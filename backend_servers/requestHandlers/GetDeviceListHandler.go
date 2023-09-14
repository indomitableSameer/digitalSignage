package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetDeviceListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived getDevicelist request")
	var dbdevList []dbentities.DeviceList
	result := dbprovider.Conn.RDb.Limit(10).Order("Created_At desc").Find(&dbdevList)

	var resDevList []response.DeviceList
	for i := 0; i < int(result.RowsAffected); i++ {
		item := response.DeviceList{
			Id:        dbdevList[i].DeviceId,
			Mac:       dbdevList[i].Mac,
			Location:  "Germany",
			CreatedAt: dbdevList[i].CreatedAt,
		}
		resDevList = append(resDevList, item)
	}

	json, _ := json.Marshal(resDevList)
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
	return
}
