package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/alexkarpovich/web-convnet/api/handlers"
)

func main() {
	wsHandler := new(handlers.WSHandler)
	router := mux.NewRouter()
	router.HandleFunc("/", wsHandler.Index)
	http.Handle("/", router)

	if err := http.ListenAndServe(":7777", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
