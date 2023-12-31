import json
import os
import logging
from time import sleep
import appdb as appdb
import secure_conn as secure_conn
from httpStatus import HttpStatus
import globalVariables as gv
import shutil

FILE_PATH = "./media/content.mp4"
TEMP_FILE_PATH = "./media/content.mp4"


def getUpdatedContent(log: logging):
    while True:
        try:
            log.info("waiting on content_event..")
            if gv.content_event.wait() == True:
                log.info("content_event is set..")
                conn_details = appdb.getConnDetailsFromDb()
                reg_details = appdb.getRegistrationDetailsFromDb()
                contentinfo_details = appdb.getPlayScheduleFromDb()
                if reg_details.reg_id != None:
                    log.info("sending content request request..")
                    connection = secure_conn.getConnection(
                        conn_details.service_url, int(conn_details.service_port))
                    connection.connect()

                    headers = {'Content-type': 'application/json'}
                    req = {"RegistrationId": reg_details.reg_id}
                    connection.request("GET", "/device/getContent",
                                       json.dumps(req), headers)

                    response = connection.getresponse()
                    log.info(
                        "Status Update: server response code for content req -> " + str(response.status))
                    # print(response.getheaders())

                    if response.status == HttpStatus.OK:
                        contentId = response.headers.get('Content-Id')
                        contentLen = response.headers.get('Content-Length')
                        with open(TEMP_FILE_PATH, 'wb') as out_file:
                            # print("going to read response")
                            while chunk := response.read(200):
                                # print(len(chunk))
                                # shutil.copy(chunk, out_file)
                                out_file.write(chunk)
                            # body = response.read()
                            # out_file.write(body)
                    # print("going to close channel")
                    log.info("rec file size :" +
                             str(os.path.getsize(TEMP_FILE_PATH)))
                    log.info("header file size :" + str(contentLen))
                    log.info("content id : " + contentId)
                    if os.path.getsize(TEMP_FILE_PATH) == int(contentLen):
                        log.info(
                            "file downloaded successfully. moving from temp place to media location..")
                        shutil.move(TEMP_FILE_PATH, FILE_PATH)
                    connection.close()
                    appdb.InsertOrUpdateContentInfoInDb(
                        contentinfo_details.id, contentId, "content.mp4", FILE_PATH, "mp4")
                log.info("clearing content_event..")
                gv.content_event.clear()
        except Exception as e:
            log.error(e)
            gv.content_event.clear()
