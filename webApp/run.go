package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./build/")))
	fmt.Println("starting webapp in ./build at port 3000")
	http.ListenAndServe(":3000", nil)
}
