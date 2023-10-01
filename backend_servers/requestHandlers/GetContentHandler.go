package requesthandlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
	"github.com/minio/minio-go/v7"
)

func HandleGetContentRequest(w http.ResponseWriter, r *http.Request) {
	var contentReq requests.ContentRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &contentReq)
	if err != nil {
		fmt.Println("error:", err)
		http.Error(w, "Unable to parse request", http.StatusBadRequest)
		return
	}

	var regDev dbentities.DeviceRegistrationDirectory
	dbprovider.Conn.RDb.Where("Registration_Id = ?", contentReq.RegistrationId).First(&regDev)
	fmt.Println(regDev)

	if regDev.RegistrationId != uuid.Nil {
		var aAllocatedContent dbentities.ContentAllocationDirectory
		dbprovider.Conn.RDb.Where("device_id = ?", regDev.DeviceId).First(&aAllocatedContent)

		if aAllocatedContent.Id != uuid.Nil {
			var aContentInfo dbentities.ContentInfo
			dbprovider.Conn.RDb.Where("content_id = ?", aAllocatedContent.ContentInfoId).First(&aContentInfo)
			if aContentInfo.ContentId != uuid.Nil && aContentInfo.FileBacketObjId != uuid.Nil {
				// now here load fine binary form bucket and send to client
				objectInfo, err := dbprovider.Conn.ObjDb.StatObject(context.Background(), dbprovider.BucketInfo.FileBucket, aContentInfo.FileBacketObjId.String(), minio.StatObjectOptions{})
				if err != nil {
					fmt.Println("getting object stat failed.", err)
					http.Error(w, "failed to get object status.", http.StatusInternalServerError)
					return
				}

				object, err := dbprovider.Conn.ObjDb.GetObject(context.Background(), dbprovider.BucketInfo.FileBucket, aContentInfo.FileBacketObjId.String(), minio.GetObjectOptions{})
				if err != nil {
					fmt.Println("retriving object failed", err)
					http.Error(w, "failed to retrive content.", http.StatusInternalServerError)
					return
				}
				defer object.Close()

				//Transmit the headers
				w.Header().Set("Expires", "0")
				w.Header().Set("Content-Transfer-Encoding", "binary")
				w.Header().Set("Content-Control", "private, no-transform, no-store, must-revalidate")
				//w.Header().Set("Content-Disposition", "attachment; filename=v.mp4")
				//w.Header().Set("Content-Type", fileType)
				w.Header().Set("Content-Length", strconv.FormatInt(objectInfo.Size, 10))

				if _, err = io.Copy(w, object); err != nil {
					fmt.Println("failed to copy object to http reponse.", err)
					http.Error(w, "failed to copy object to response", http.StatusInternalServerError)
					return
				}

			} else {
				fmt.Println("ContentInfo not found for allocated content.")
				http.Error(w, "missing content info in backend", http.StatusInternalServerError)
				return
			}
		}

	} else {
		fmt.Println("Reg id not found")
		http.Error(w, "registration not found", http.StatusBadRequest)
		return
	}
	return
}
