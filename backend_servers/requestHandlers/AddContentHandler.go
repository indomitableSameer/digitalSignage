package requesthandlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
	"github.com/minio/minio-go/v7"
)

func HandleAddContentRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("received /addContent request..")
	const contentInfoBucket = "dss-content-thumbnail-files"
	const contentFileBucket = "dss-content-video-files"

	var file, _, err = r.FormFile("File")
	filename := r.FormValue("FileName")
	description := r.FormValue("Description")
	filesize := r.FormValue("FileSize")

	if err != nil || len(filename) == 0 {
		fmt.Println("Error", err)
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	defer file.Close()

	num, err := strconv.Atoi(filesize)
	if err != nil {
		// Handle the error if the conversion fails
		fmt.Println("Error", err)
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	var contentId = uuid.New()
	var fileId = uuid.New()
	var thumbnailId = uuid.New()
	var contentInfo = dbentities.ContentInfo{
		ContentId:            contentId,
		FileName:             filename,
		Description:          description,
		ThumbnailBucketObjId: thumbnailId,
		FileBacketObjId:      fileId,
		CreatedAt:            time.Now(),
	}

	//getThumbnailStream(file)

	var info, errr = dbprovider.Conn.ObjDb.PutObject(context.Background(), contentFileBucket, fileId.String(), file, int64(num), minio.PutObjectOptions{})
	if errr != nil {
		fmt.Println(err)
		http.Error(w, "Failed to make file object entry", http.StatusInternalServerError)
		return
	}

	result := dbprovider.Conn.RDb.Create(&contentInfo)
	if result.Error != nil {
		dbprovider.Conn.ObjDb.RemoveObject(context.Background(), contentFileBucket, fileId.String(), minio.RemoveObjectOptions{})
		http.Error(w, "Failed to make a entry in database", http.StatusInternalServerError)
		return
	}

	var dbContentInfo []dbentities.ContentInfo
	res := dbprovider.Conn.RDb.Order("Created_At desc").Find(&dbContentInfo)

	var resContentList []response.ContentList
	for i := 0; i < int(res.RowsAffected); i++ {
		fmt.Println(dbContentInfo[i].CreatedAt)
		fmt.Println(dbContentInfo[i].CreatedAt.Format("02/01/2006"))
		item := response.ContentList{
			Id:          dbContentInfo[i].ContentId,
			Name:        dbContentInfo[i].FileName,
			Description: dbContentInfo[i].Description,
			Date:        dbContentInfo[i].CreatedAt.Format("02/01/2006"),
			Time:        dbContentInfo[i].CreatedAt.Format("15:04:05"),
		}
		resContentList = append(resContentList, item)
	}

	json, _ := json.Marshal(resContentList)
	w.Header().Set("content-type", "application/json")
	w.Write(json)

	fmt.Println("Object uploaded successfully", info)
	return
}
