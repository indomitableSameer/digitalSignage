package main

import (
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("/root/digitalSignage/webApp/build/")))
	http.ListenAndServe(":3000", nil)
}
