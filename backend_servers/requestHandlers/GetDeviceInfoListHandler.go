package requesthandlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	response "github.com/indomitableSameer/digitalSignage/backend_servers/responses"
)

func getRegistrationDetails(deviceId uuid.UUID) (bool, string) {
	var aDevRegEntry dbentities.DeviceRegistrationDirectory
	result := dbprovider.Conn.RDb.Where("device_id = ?", deviceId).Find(&aDevRegEntry)
	if result.Error == nil && aDevRegEntry.RegistrationId != uuid.Nil {
		return true, aDevRegEntry.CreatedAt.Format(time.DateTime)
	}

	return false, ""
}

func getLocationInfo(area uint64) (string, string, string, string) {

	var aArea dbentities.Area
	var aBuilding dbentities.Building
	var aCity dbentities.City
	var aCountry dbentities.Country

	dbprovider.Conn.RDb.Where("id = ?", area).Find(&aArea)
	dbprovider.Conn.RDb.Where("id = ?", aArea.BuildingId).Find(&aBuilding)
	dbprovider.Conn.RDb.Where("id = ?", aBuilding.CityId).Find(&aCity)
	dbprovider.Conn.RDb.Where("id = ?", aCity.CountryId).Find(&aCountry)

	return aArea.Name, aBuilding.Name, aCity.Name, aCountry.Name
}

func getDevSchedule(deviceId uuid.UUID) (string, string, string, string) {
	var aDevSchedEntry dbentities.ScheduleAllocationDirectory
	result := dbprovider.Conn.RDb.Where("device_id = ?", deviceId).Find(&aDevSchedEntry)
	if result.Error == nil && aDevSchedEntry.Id != uuid.Nil {
		return aDevSchedEntry.StartDate, aDevSchedEntry.EndDate, aDevSchedEntry.StartTime, aDevSchedEntry.EndTime
	}
	return "", "", "", ""
}

func getDevCententInfo(deviceId uuid.UUID) string {
	var aDevContentEntry dbentities.ContentAllocationDirectory
	result := dbprovider.Conn.RDb.Where("device_id = ?", deviceId).Find(&aDevContentEntry)
	if result.Error == nil && aDevContentEntry.Id != uuid.Nil {
		var aContentInfoEntry dbentities.ContentInfo
		dbprovider.Conn.RDb.Where("content_id = ?", aDevContentEntry.ContentInfoId).Find(&aContentInfoEntry)
		if aContentInfoEntry.ContentId != uuid.Nil {
			return aContentInfoEntry.FileName
		}
	} else {
		fmt.Println("failed to find content alloc entry")
	}
	return ""
}

// TODO: this function can get the true schedule and content running on dev.. currently gathered is not true value.
func extractStatusInfos(deviceId uuid.UUID) (bool, string, string, string, string) {
	var aDevRegEntry dbentities.DeviceRegistrationDirectory
	result := dbprovider.Conn.RDb.Where("device_id = ?", deviceId).Find(&aDevRegEntry)
	if result.Error == nil && aDevRegEntry.RegistrationId != uuid.Nil {
		var aDevStausEntry dbentities.DeviceStatusRegister
		dbprovider.Conn.RDb.Where("registration_id = ?", aDevRegEntry.RegistrationId).Find(&aDevStausEntry)
		if aDevStausEntry.StatusId != uuid.Nil {
			var online = !aDevStausEntry.UpdatedAt.Before(time.Now().Add(-5 * time.Minute))
			var osVer = aDevStausEntry.OsVersion
			var appVer = aDevStausEntry.AppVersion
			var ipAddr = aDevStausEntry.IpAddr
			var lastUpdate = aDevStausEntry.UpdatedAt.Format(time.DateTime)
			return online, osVer, appVer, ipAddr, lastUpdate
		}
	}

	return false, "", "", "", ""
}

func HandleGetDeviceInfoListRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("recived getDevicelist request")
	var dbdevList []dbentities.DeviceDirectory
	result := dbprovider.Conn.RDb.Order("Created_At desc").Find(&dbdevList)

	var resDevList []response.DeviceInfo
	for i := 0; i < int(result.RowsAffected); i++ {
		var item response.DeviceInfo
		item.Mac = dbdevList[i].MAC
		item.DevAddedOn = dbdevList[i].CreatedAt.Format(time.DateTime)
		item.IsRegistered, item.DevRegOn = getRegistrationDetails(dbdevList[i].DeviceID)
		item.IsOnline, item.DeviceOS, item.DeviceAppVer, item.DeviceIp, item.LastUpdateAt = extractStatusInfos(dbdevList[i].DeviceID)
		item.ContentFileName = getDevCententInfo(dbdevList[i].DeviceID)
		item.StartDate, item.EndDate, item.StartTime, item.EndTime = getDevSchedule(dbdevList[i].DeviceID)
		item.Area, item.Building, item.City, item.Country = getLocationInfo(dbdevList[i].AreaId)

		resDevList = append(resDevList, item)
	}

	json, _ := json.Marshal(resDevList)
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "https://web.dss.com")
	w.Write(json)
	return
}
