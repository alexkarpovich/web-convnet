package handlers

import (
	"log"
	"io/ioutil"
	"net/http"
	"encoding/json"
	"github.com/gorilla/websocket"
	"github.com/alexkarpovich/convnet"
	"github.com/alexkarpovich/convnet/config"
)

type Message struct {
	Type string `json:"type"`
	Data interface{} `json:"data"`
}

type WSHandler struct {}

var cnn *convnet.Net

func (h *WSHandler) Index(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		return
	}
	var data json.RawMessage
	message := Message{Data:&data}

	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			panic(err)
		}

		outmsg := HandleMessage(message, data)

		if err = conn.WriteJSON(&outmsg); err != nil {
			panic(err)
		}
	}
}

func HandleMessage(msg Message, data json.RawMessage) Message {

	switch msg.Type {
	case "net:setup":
		conf := config.Net{}
		json.Unmarshal(data, &conf)

		cnn = new(convnet.Net)
		cnn.FromConfig(conf)

		byteConfig, err := json.Marshal(conf)
		if err != nil {
			log.Fatalf("File error: %v\n", err)
			panic(err)
		}
		ioutil.WriteFile("configs/net1.json", byteConfig, 0644)

		log.Println("New network was successfully set up")
		break
	case "net:config":
		file, err := ioutil.ReadFile("config/net1.json")
		if err != nil {
			log.Fatalf("File error: %v\n", err)
		}

		return Message{Type:"net:config", Data: file}
		break
	}

	return msg
}