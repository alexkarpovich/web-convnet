package handlers

import (
	"log"
	"io/ioutil"
	"github.com/alexkarpovich/convnet"
	"github.com/gorilla/websocket"
	"encoding/json"
	"github.com/alexkarpovich/convnet/interfaces"
	"github.com/alexkarpovich/convnet/config"
	. "github.com/petar/GoMNIST"
)

type Handler struct {
	Net *convnet.Net
	Conn *websocket.Conn
	Hub *Hub
}

type Message struct {
	Type string `json:"type"`
	Data interface{} `json:"data"`
}

var cnn *convnet.Net

func (h *Handler) Init(conn *websocket.Conn) {
	h.Conn = conn
	h.Hub = HubInstance()

	if cnn == nil {
		cnn = new(convnet.Net)
		h.Hub.NetState = cnn.FromConfig(getNetConfig())
		cnn.LoadWeights(getNetWeights())
	}

	h.Hub.Join <- conn
	defer func() {
		h.Hub.Leave <- conn
	}()

	var data json.RawMessage
	message := Message{Data:&data}

	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println("Handler init ", err)
			break
		}

		h.Handle(message, data)
	}
}

func (h *Handler) Handle(msg Message, data json.RawMessage) {

	switch msg.Type {
	case "net:setup": h.netSetup(data)
	case "net:config": h.netConfig(data)
	case "training:start": h.startTraining(data)
	case "training:stop": h.stopTraining(data)
	case "training:state": h.trainingState(data)
	case "net:saveWeights": h.netSaveWeights(data)
	case "net:test": h.netTest(data);
	}
}

func check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func getNetConfig() config.Net {
	file, err := ioutil.ReadFile("configs/net1.json")
	check(err);
	conf := config.Net{}
	err = json.Unmarshal(file, &conf)
	check(err)

	return conf
}

func getNetWeights() []interfaces.WeightsState {
	file, err := ioutil.ReadFile("configs/weights.json")
	check(err);
	weights := []interfaces.WeightsState{}
	err = json.Unmarshal(file, &weights)
	check(err)

	return weights
}

func saveWeights() {
	weights := cnn.Weights()
	byteWeights, err := json.Marshal(weights)
	check(err)
	ioutil.WriteFile("configs/weights.json", byteWeights, 0644)
}

func trainingState(h *Handler, state bool) {
	err := h.Conn.WriteJSON(Message{Type: "training:state", Data: state})
	check(err)
}

func (h *Handler) netSetup(data json.RawMessage) {
	conf := config.Net{}
	json.Unmarshal(data, &conf)

	cnn = new(convnet.Net)
	h.Hub.NetState = cnn.FromConfig(conf)

	byteConfig, err := json.Marshal(conf)
	check(err)
	ioutil.WriteFile("configs/net1.json", byteConfig, 0644)
}

func (h *Handler) netConfig(data json.RawMessage) {
	conf := getNetConfig()
	err := h.Conn.WriteJSON(Message{Type: "net:config", Data: conf})
	check(err)
}

func (h *Handler) startTraining(data json.RawMessage) {
	trainParams := interfaces.TrainParams{}
	json.Unmarshal(data, &trainParams)

	trainingSet, _,  err := Load("/home/aliaksandr/dev/gopacks/src/github.com/petar/GoMNIST/data")
	check(err)

	go func() {
		cnn.Train(trainParams, trainingSet)
		trainingState(h ,false)
	}()

	trainingState(h, true)
}

func (h *Handler) stopTraining(data json.RawMessage) {
	cnn.StopTraining()
	trainingState(h, false)
}

func (h *Handler) trainingState(data json.RawMessage) {
	trainingState(h, cnn.IsTraining())
}

func (h *Handler) netSaveWeights(data json.RawMessage) {
	saveWeights()
}

func (h *Handler) netTest(data json.RawMessage) {
	var rawImage []byte
	json.Unmarshal(data, &rawImage);

	err := h.Conn.WriteJSON(Message{Type: "net:test", Data: cnn.Test(rawImage)})
	check(err)
}