package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func HandleGetCountryListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived /getCountryList request")
	var dbCountries []dbentities.Country
	result := dbprovider.Conn.RDb.Find(&dbCountries)

	var resCountryList []response.CountryList
	for i := 0; i < int(result.RowsAffected); i++ {
		item := response.CountryList{
			Id:   dbCountries[i].Id,
			Name: dbCountries[i].Name,
		}
		resCountryList = append(resCountryList, item)
	}

	json, _ := json.Marshal(resCountryList)
	w.Header().Set("content-type", "application/json")
	w.Write(json)
	return
}
