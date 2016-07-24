package handlers

import (
	"github.com/gorilla/websocket"
	"github.com/alexkarpovich/convnet/interfaces"
	"log"
	"sync"
)

type Hub struct {
	Join chan *websocket.Conn
	Leave chan *websocket.Conn
	NetState chan interfaces.NetState
	conns map[*websocket.Conn]bool
	mu sync.Mutex
}

var hub *Hub

func HubInstance() *Hub {
	if hub == nil {
		hub = new(Hub)
		hub.conns = make(map[*websocket.Conn]bool)
		hub.Join = make(chan *websocket.Conn)
		hub.Leave = make(chan *websocket.Conn)
	}

	go func() {
		hub.Run()
	}()

	return hub
}

func (h *Hub) Run() {
	for {
		select {
		case c := <-h.Join:
			h.mu.Lock()
			h.conns[c] = true
			h.mu.Unlock()
		case c := <-h.Leave:
			h.mu.Lock()
			delete(h.conns, c)
			h.mu.Unlock()
		case s := <-h.NetState:
			h.mu.Lock()
			length := len(h.conns)
			if length > 0 {
				for conn := range h.conns {
					err := conn.WriteJSON(Message{Type: "net:state", Data: s})
					if err != nil {
						log.Fatal("Hub run ", err)
					}
				}
			}
			h.mu.Unlock()
		}
	}
}
