package main

import (
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("/root/digitalSignage/dssWebApp2/build/")))
	http.ListenAndServe(":3000", nil)
}
