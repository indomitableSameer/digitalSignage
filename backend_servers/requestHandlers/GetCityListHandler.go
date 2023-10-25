package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetCityListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived getCityList request")
	var dbCities []dbentities.City
	result := dbprovider.Conn.RDb.Order("name asc").Find(&dbCities)

	var resCityList []response.CityList
	for i := 0; i < int(result.RowsAffected); i++ {
		item := response.CityList{
			Id:   dbCities[i].Id,
			Name: dbCities[i].Name,
		}
		resCityList = append(resCityList, item)
	}

	json, _ := json.Marshal(resCityList)
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "https://web.dss.com")
	w.Write(json)
	return
}
