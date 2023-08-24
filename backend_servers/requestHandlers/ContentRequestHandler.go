package requesthandlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	dbprovider "github.com/indomitableSameer/digitalSignage/backend_servers/dbProvider"
	"github.com/indomitableSameer/digitalSignage/backend_servers/dbentities"
	"github.com/indomitableSameer/digitalSignage/backend_servers/requests"
)

func HandleContentRequest(w http.ResponseWriter, r *http.Request) {
	var contentReq requests.ContentRequest
	body, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(body, &contentReq)
	if err != nil {
		fmt.Println("error:", err)
	}

	var regDev dbentities.DeviceRegistration
	dbprovider.DBObj.Where("Registration_Id = ?", contentReq.Id).First(&regDev)
	fmt.Println(regDev)

	//if contentReq.ID != uuid.Nil &&
}
