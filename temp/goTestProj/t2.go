package main

import (
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
)

func main() {
	http.HandleFunc("/", downloadToClient)

	port := ":9000"
	log.Println("Download update files from localhost" + port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Println(err)
	}

}

func downloadToClient(w http.ResponseWriter, r *http.Request) {

	// there is where we want to do some simple verification
	// if the app(client) did not supply the correct parameter, which is - "updatefile"
	// abort!

	fileName := r.URL.Query().Get("updatefile")

	if fileName == "" {
		// return 400 HTTP response code for BAD REQUEST
		http.Error(w, "Update failed due to malformed URL.", 400)
		return
	}

	// For more advance authentication, see
	// https://www.socketloop.com/tutorials/golang-simple-client-server-hmac-authentication-without-ssl-example

	// get client ip address
	ip, _, _ := net.SplitHostPort(r.RemoteAddr)

	log.Println("Transmiting to client at " + ip + " : " + fileName)

	// Do we have the update with the given filename?

	updateFile, err := os.Open(fileName)

	defer updateFile.Close()

	if err != nil {
		// return 404 HTTP response code for File not found
		http.Error(w, "Update file not found.", 404)
		return
	}

	// Prepare the update file to be sent over to the client(which in this case is an APP)

	fileHeader := make([]byte, 512)                // 512 bytes is sufficient for http.DetectContentType() to work
	updateFile.Read(fileHeader)                    // read the first 512 bytes from the updateFile
	fileType := http.DetectContentType(fileHeader) // set the type

	fileInfo, _ := updateFile.Stat()
	fileSize := fileInfo.Size()

	//Transmit the headers
	w.Header().Set("Expires", "0")
	w.Header().Set("Content-Transfer-Encoding", "binary")
	w.Header().Set("Content-Control", "private, no-transform, no-store, must-revalidate")
	w.Header().Set("Content-Disposition", "attachment; filename="+fileName)
	w.Header().Set("Content-Type", fileType)
	w.Header().Set("Content-Length", strconv.FormatInt(fileSize, 10))

	//Send the file
	updateFile.Seek(0, 0)  // reset back to position since we've read first 512 bytes of data previously
	io.Copy(w, updateFile) // transmit the updatefile bytes to the client
	return
}
