package requesthandlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

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
	dbprovider.Conn.RDb.Where("Registration_Id = ?", contentReq.Id).First(&regDev)
	fmt.Println(regDev)

	// here instead of sending file directly, we will use db to read and send file.
	updateFile, err := os.Open("/root/digitalSignage/device/v.mp4")
	defer updateFile.Close()

	if err != nil {
		// return 404 HTTP response code for File not found
		http.Error(w, "Update file not found.", 404)
		return
	}

	fileHeader := make([]byte, 512)
	updateFile.Read(fileHeader)
	fileType := http.DetectContentType(fileHeader)

	fileInfo, _ := updateFile.Stat()
	fileSize := fileInfo.Size()

	//Transmit the headers
	w.Header().Set("Expires", "0")
	w.Header().Set("Content-Transfer-Encoding", "binary")
	w.Header().Set("Content-Control", "private, no-transform, no-store, must-revalidate")
	//w.Header().Set("Content-Disposition", "attachment; filename=v.mp4")
	w.Header().Set("Content-Type", fileType)
	w.Header().Set("Content-Length", strconv.FormatInt(fileSize, 10))

	//Send the file
	updateFile.Seek(0, 0)  // reset back to position since we've read first 512 bytes of data previously
	io.Copy(w, updateFile) // transmit the updatefile bytes to the client
	return
	//if contentReq.ID != uuid.Nil &&
}
