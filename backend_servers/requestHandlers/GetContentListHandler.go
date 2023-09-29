package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetContentListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived getContentList request")

	var dbContentInfo []dbentities.ContentInfo
	res := dbprovider.Conn.RDb.Order("Created_At desc").Find(&dbContentInfo)

	var resContentList []response.ContentList
	for i := 0; i < int(res.RowsAffected); i++ {
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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
	return
}
