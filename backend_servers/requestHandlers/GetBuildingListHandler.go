package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetBuildingListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived getBuildingList request")
	var dbBuilding []dbentities.Building
	result := dbprovider.Conn.RDb.Order("name asc").Find(&dbBuilding)

	var resBuildingList []response.BuildingList
	for i := 0; i < int(result.RowsAffected); i++ {
		item := response.BuildingList{
			Id:   dbBuilding[i].Id,
			Name: dbBuilding[i].Name,
		}
		resBuildingList = append(resBuildingList, item)
	}

	json, _ := json.Marshal(resBuildingList)
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "https://web.dss.com")
	w.Write(json)
	return
}
