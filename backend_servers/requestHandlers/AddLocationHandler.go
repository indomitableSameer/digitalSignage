package requesthandlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
)

func HandleAddLocationRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("adding location to db")
	var addLocReq requests.AddLocation
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &addLocReq)
	if err != nil {
		fmt.Println("error:", err)
		http.Error(w, "Unable to parse request", http.StatusBadRequest)
		return
	}

	fmt.Println(addLocReq)
	var aCountryList dbentities.Country
	dbprovider.Conn.RDb.Where("name = ?", addLocReq.Country).First(&aCountryList)
	if aCountryList.Name == addLocReq.Country {

		var aCity dbentities.City
		dbprovider.Conn.RDb.Where("name = ?", addLocReq.City).First(&aCity)
		if aCity.Id <= 0 && len(addLocReq.City) > 0 {
			aCity.Name = addLocReq.City
			aCity.CountryId = aCountryList.Id
			result := dbprovider.Conn.RDb.Create(&aCity)
			if result.Error != nil {
				http.Error(w, "somthing went wrong when adding city", http.StatusInternalServerError)
				return
			}
			// after adding read, so that for next we can have ids
			dbprovider.Conn.RDb.Where("name = ?", addLocReq.City).First(&aCity)
		} else {
			http.Error(w, "city info is null", http.StatusBadRequest)
			return
		}

		var aBuilding dbentities.Building
		dbprovider.Conn.RDb.Where("name = ?", addLocReq.Building).First(&aBuilding)
		if aBuilding.Id <= 0 && len(addLocReq.Building) > 0 {
			aBuilding.Name = addLocReq.Building
			aBuilding.CityId = aCity.Id
			result := dbprovider.Conn.RDb.Create(&aBuilding)
			if result.Error != nil {
				http.Error(w, "somthing went wrong when adding building", http.StatusInternalServerError)
				return
			}
			// after adding read, so that for next we can have ids
			dbprovider.Conn.RDb.Where("name = ?", addLocReq.Building).First(&aBuilding)
		} else {
			http.Error(w, "Building info is null", http.StatusBadRequest)
			return
		}

		var aArea dbentities.Area
		dbprovider.Conn.RDb.Where("name = ?", addLocReq.Area).First(&aArea)
		if aArea.Id <= 0 && len(addLocReq.Area) > 0 {
			aArea.Name = addLocReq.Area
			aArea.BuildingId = aBuilding.Id
			result := dbprovider.Conn.RDb.Create(&aArea)
			if result.Error != nil {
				http.Error(w, "somthing went wrong when adding building", http.StatusInternalServerError)
				return
			}
			// after adding read, so that for next we can have ids
			dbprovider.Conn.RDb.Where("name = ?", addLocReq.Area).First(&aArea)
		} else {
			http.Error(w, "Area info is null", http.StatusBadRequest)
			return
		}

		// add device mac to deviceDirectory
		var aDevDir dbentities.DeviceDirectory
		dbprovider.Conn.RDb.Where("mac = ?", addLocReq.Mac).First(&aDevDir)
		if (aDevDir.DeviceID != uuid.Nil) && (aDevDir.MAC == addLocReq.Mac) {
			http.Error(w, "device id is already located, please delete if you want to add to another location", http.StatusInternalServerError)
			return
		} else if len(addLocReq.Mac) > 0 {
			aDevDir.DeviceID = uuid.New()
			aDevDir.MAC = addLocReq.Mac
			aDevDir.AreaId = aArea.Id
			result := dbprovider.Conn.RDb.Create(&aDevDir)
			if result.Error != nil {
				http.Error(w, "somthing went wrong when adding device", http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "Mac info is null", http.StatusBadRequest)
			return
		}

		// allocate content
		var aContentInfoItem dbentities.ContentInfo
		dbprovider.Conn.RDb.Where("content_id = ?", addLocReq.ContentInfoId).First(&aContentInfoItem)
		if aContentInfoItem.ContentId != uuid.Nil {
			var aDevContent dbentities.ContentAllocationDirectory
			aDevContent.Id = uuid.New()
			aDevContent.ContentInfoId = aContentInfoItem.ContentId
			aDevContent.DeviceId = aDevDir.DeviceID
			result := dbprovider.Conn.RDb.Create(&aDevContent)
			if result.Error != nil {
				http.Error(w, "somthing went wrong while content allocation", http.StatusInternalServerError)
				return
			}
		}

		// allocate schedule
		var aDevSchedule dbentities.ScheduleAllocationDirectory
		aDevSchedule.Id = uuid.New()
		aDevSchedule.DeviceId = aDevDir.DeviceID
		aDevSchedule.StartDate = addLocReq.StartDate
		aDevSchedule.EndDate = addLocReq.EndDate
		aDevSchedule.StartTime = addLocReq.StartTime
		aDevSchedule.EndTime = addLocReq.EndTime
		result := dbprovider.Conn.RDb.Create(&aDevSchedule)
		if result.Error != nil {
			http.Error(w, "somthing went wrong when adding schedule", http.StatusInternalServerError)
			return
		}
	}
	return
}
