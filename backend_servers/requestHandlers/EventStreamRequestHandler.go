package requesthandlers

import (
	"fmt"
	"net/http"
	"time"
)

func HandleEventStreamRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("HandleEventRequest")
	// Set the headers for Server-Sent Events
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// Create a new ticker that sends a message every 2 seconds
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	// Send a message every time the ticker ticks
	for {
		select {
		case <-ticker.C:
			fmt.Fprintf(w, "data: Message from server %s\n\n", time.Now().Format("15:04:05"))
			w.(http.Flusher).Flush() // Flush the response to send the event immediately
		case <-r.Context().Done():
			return
		}
	}
}
