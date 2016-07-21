package handlers

import (
	"log"
	"net/http"
	"encoding/json"
	"github.com/gorilla/websocket"
	//"github.com/alexkarpovich/convnet"
	"github.com/alexkarpovich/convnet/config"
)

type Message struct {
	Type string `json:"type"`
	Data []byte `json:"data"`
}

type WSHandler struct {}

func (h *WSHandler) Index(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		return
	}

	message := Message{}

	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			panic(err)
		}

		outmsg := HandleMessage(message)

		if err = conn.WriteJSON(&outmsg); err != nil {
			panic(err)
		}
	}
}

func HandleMessage(msg Message) Message {

	switch msg.Type {
	case "net:setup":
		data := config.Net{}
		json.Unmarshal(msg.Data, &data)
		log.Println(data.Size)
	}

	return msg
}