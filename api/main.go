package main

import (
	//"fmt"
	//"github.com/alexkarpovich/convnet/api/convnet"
	//"github.com/alexkarpovich/convnet/api/convnet/interfaces"
	//. "github.com/petar/GoMNIST"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)


func wsHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		return
	}

	ws.WriteJSON([]string{"nigger", "dilliger"})
}


func main() {
	//cnn := &convnet.Net{}
	//cnn.Init()
	//
	//trainingSet, _,  err := Load("/home/aliaksandr/dev/gopacks/src/github.com/petar/GoMNIST/data")
	//if err != nil {
	//	fmt.Println(err)
	//}
	//
	//trainParams := interfaces.TrainParams{MaxIteration:1000, MinError: 0.01}
	//go cnn.Train(trainParams, trainingSet)

	router := mux.NewRouter()
	router.HandleFunc("/", wsHandler)
	http.Handle("/", router)

	if err := http.ListenAndServe(":7777", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
