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
	"gorm.io/gorm/clause"
)

func HandleStatusRequest(w http.ResponseWriter, r *http.Request) {
	var statusReq requests.StatusUpdateRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &statusReq)
	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Println("received ", statusReq)
	var regDev dbentities.DeviceRegistrationDirectory
	dbprovider.Conn.RDb.Where("Registration_Id = ?", statusReq.Id).First(&regDev)
	fmt.Println(regDev)
	if statusReq.Id != uuid.Nil && statusReq.Id == regDev.RegistrationId {
		fmt.Println("Found device id ", regDev.DeviceId)

		// add this to db and send response
		var status dbentities.DeviceStatusRegister
		status.RegistrationId = regDev.RegistrationId
		dbprovider.Conn.RDb.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "device_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"updated_at"}),
		}).Create(&status)
		return
	}
	w.WriteHeader(http.StatusForbidden)
}
