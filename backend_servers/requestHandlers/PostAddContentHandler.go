package requesthandlers

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/minio/minio-go/v7"
)

func HandlePostAddContentRequest(w http.ResponseWriter, r *http.Request) {

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
	var contentInfo = dbentities.ContentDirectory{
		ContentId:             contentId,
		FileName:              filename,
		Description:           description,
		ThumbnailDataBucketId: thumbnailId,
		FileDataBacketId:      fileId,
		CreatedAt:             time.Now(),
	}

	var info, errr = dbprovider.Conn.ObjDb.PutObject(context.Background(), contentFileBucket, fileId.String(), file, int64(num), minio.PutObjectOptions{})
	if errr != nil {
		fmt.Println(err)
		http.Error(w, "Failed to make file object entry", http.StatusInternalServerError)
		return
	}

	result := dbprovider.DBObj.Create(&contentInfo)
	if result.Error != nil {
		dbprovider.Conn.ObjDb.RemoveObject(context.Background(), contentFileBucket, fileId.String(), minio.RemoveObjectOptions{})
		http.Error(w, "Failed to make a entry in database", http.StatusInternalServerError)
	}

	// this is not needed as we can put info in the rdbms
	// var jsonData, _ = json.Marshal(contentInfo)
	// info, errr = dbprovider.Conn.ObjDb.PutObject(context.Background(), contentInfoBucket, contentId.String(), bytes.NewReader(jsonData), int64(len(jsonData)), minio.PutObjectOptions{})
	// if errr != nil {
	// 	fmt.Println(err)
	// 	http.Error(w, "Failed to make entry", http.StatusInternalServerError)
	// 	return
	// }

	fmt.Println("Object uploaded successfully", info)
	return
}
