import sqlite3
from collections import namedtuple

DB_FILE_PATH = 'app.db'

def connectNExecute(query):
    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    cursor.execute(query)
    row = cursor.fetchone()
    return row

def getDeviceInfoFromDb():
    conn = sqlite3.connect(DB_FILE_PATH)
    dev_info = namedtuple('device_info', ['id', 'timezone'])
    cursor = conn.cursor()
    cursor.execute("SELECT id, timezone FROM device_info")
    row = cursor.fetchone()

    if row:
        db_dev_info = dev_info(*row)
        conn.close()
        return db_dev_info
    else:
        conn.close()

def InsertOrUpdateDeviceInfoInDb(id, timezone):
    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO device_info (id, timezone) values (?, ?)", (id, timezone))
    conn.commit()
    conn.close()

def getContentInfoFromDb():
    conn = sqlite3.connect(DB_FILE_PATH)
    content_info = namedtuple('content_info', ['id', 'content_id', 'file_name', 'file_loc', 'file_type'])
    cursor = conn.cursor()
    cursor.execute("SELECT id, content_id, file_name, file_loc, file_type FROM content_info")
    row = cursor.fetchone()

    if row:
        db_content_info = content_info(*row)
        conn.close()
        return db_content_info
    else:
        conn.close()

def InsertOrUpdateContentInfoInDb(id, content_id, file_name, file_loc, file_type):
    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO content_info (id, content_id, file_name, file_loc, file_type) values (?, ?, ?, ?, ?)", (id, content_id, file_name, file_loc, file_type))
    conn.commit()
    conn.close()

def getPlayScheduleFromDb():
    conn = sqlite3.connect(DB_FILE_PATH)
    play_schedule = namedtuple('play_schedule', ['id', 'schedule_id', 'start_date', 'end_date', 'start_time', 'end_time'])
    cursor = conn.cursor()
    cursor.execute("SELECT id, schedule_id, start_date, end_date, start_time, end_time FROM play_schedule")
    row = cursor.fetchone()

    if row:
        db_play_sched = play_schedule(*row)
        conn.close()
        return db_play_sched
    else:
        conn.close()

def InsertOrUpdatePlayScheduleInDb(id, schedule_id, start_date, end_date, start_time, end_time):
    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO play_schedule (id, schedule_id, start_date, end_date, start_time, end_time) values (?, ?, ?, ?, ?, ?)", (id, schedule_id, start_date, end_date, start_time, end_time))
    conn.commit()
    conn.close()

def getConnDetailsFromDb():
    conn = sqlite3.connect(DB_FILE_PATH)
    conn_details = namedtuple('conn_details', ['id', 'registration_url', 'registration_port', 'service_url', 'service_port'])
    cursor = conn.cursor()
    cursor.execute("SELECT id, registration_url, registration_port, service_url, service_port FROM conn_details")
    row = cursor.fetchone()

    if row:
        db_con_details = conn_details(*row)
        conn.close()
        return db_con_details
    else:
        conn.close()

def InsertOrUpdateConnDetailsInDb(id, registration_url, registration_port, service_url, service_port):
    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO conn_details (id, registration_url, registration_port, service_url, service_port) values (?, ?, ?, ?, ?)", (id, registration_url, registration_port, service_url, service_port))
    for row in cursor.execute("SELECT id, registration_url, registration_port, service_url, service_port FROM conn_details"):
        print(row)
    conn.commit()
    conn.close()

def getRegistrationDetailsFromDb():
    conn = sqlite3.connect(DB_FILE_PATH)
    reg_details = namedtuple('reg_details', ['id', 'reg_id'])
    cursor = conn.cursor()
    cursor.execute("SELECT id, reg_id FROM reg_details")
    row = cursor.fetchone()

    if row:
        db_reg_details = reg_details(*row)
        conn.close()
        return db_reg_details
    else:
        conn.close()

def InsertOrUpdateRegDetailsInDb(id, reg_id):
    conn = sqlite3.connect(DB_FILE_PATH)
    cursor = conn.cursor()
    print(id)
    print(reg_id)
    cursor.execute("INSERT OR REPLACE INTO reg_details (id, reg_id) values (?, ?)", (id, reg_id))
    for row in cursor.execute("SELECT id, reg_id FROM reg_details"):
        print(row)
    conn.commit()
    conn.close()