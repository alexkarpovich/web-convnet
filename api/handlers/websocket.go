package handlers

import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)

type WSHandler struct {}

func (h *WSHandler) Index(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		log.Fatal(err)
		return
	}
	defer conn.Close()

	handler := new(Handler)
	handler.Init(conn)
}

