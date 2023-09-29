package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetAreaListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived getAreaList request")
	var dbAreas []dbentities.Area
	result := dbprovider.Conn.RDb.Order("name asc").Find(&dbAreas)

	var resAreaList []response.AreaList
	for i := 0; i < int(result.RowsAffected); i++ {
		item := response.AreaList{
			Id:   dbAreas[i].Id,
			Name: dbAreas[i].Name,
		}
		resAreaList = append(resAreaList, item)
	}

	json, _ := json.Marshal(resAreaList)
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
	return
}
