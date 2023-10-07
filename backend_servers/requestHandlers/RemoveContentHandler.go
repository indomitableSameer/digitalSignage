package requesthandlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
	"github.com/minio/minio-go/v7"
)

func HandleRemoveContentRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived removeContent request")
	const contentInfoBucket = "dss-content-thumbnail-files"
	const contentFileBucket = "dss-content-video-files"

	var removeContentReq requests.RemoveContent
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &removeContentReq)
	if err != nil || len(removeContentReq.ContentId) == 0 {
		fmt.Println("error:", err)
	}

	var aContentInfo dbentities.ContentInfo
	dbprovider.Conn.RDb.Where("content_id = ?", removeContentReq.ContentId).First(&aContentInfo)
	if aContentInfo.ContentId == uuid.Nil {
		http.Error(w, "failed to content with the given Id.", http.StatusBadRequest)
		return
	}

	var aContentAllocDir []dbentities.ContentAllocationDirectory
	dbprovider.Conn.RDb.Where("content_info_id = ?", removeContentReq.ContentId).Find(&aContentAllocDir)
	if len(aContentAllocDir) > 0 {
		http.Error(w, "Content is allocated to location, cant remove.", http.StatusForbidden)
		return
	}

	err = dbprovider.Conn.ObjDb.RemoveObject(context.Background(), contentFileBucket, aContentInfo.FileBacketObjId.String(), minio.RemoveObjectOptions{})
	if err != nil {
		http.Error(w, "Failed to revove object.", http.StatusInternalServerError)
		return
	}

	dbprovider.Conn.RDb.Delete(&aContentInfo)

	fmt.Println("Object removed successfully")
	return
}
