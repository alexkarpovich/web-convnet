package convnet

import (
	"fmt"
	"github.com/alexkarpovich/convnet/api/convnet/config"
	. "github.com/alexkarpovich/convnet/api/convnet/layers"
)

type Net struct {
	size []int
	in []int
	layers []ILayer
}

func (net Net) Init() {
	netConfig := config.GetNetConfig()
	net.size = netConfig.Size
	net.initLayers(netConfig.Layers)
}

func (net Net) initLayers(layersConfig []config.Layer) {
	net.layers = make([]ILayer, len(layersConfig))
	var currentLayer, prevLayer ILayer

	for i := range layersConfig {
		lconf := layersConfig[i]
		layer := &Layer{}
		layer.Init(net, lconf.Class, lconf.Size)

		switch lconf.Class {
		case "conv":
			convLayer := ConvLayer{Layer:layer}
			convLayer.Construct(lconf.Shape, lconf.Count)
			currentLayer = convLayer
			break
		case "pool": currentLayer = PoolLayer{Layer:layer}
			break
		case "fc": currentLayer = FCLayer{Layer:layer}
			break
		case "output": currentLayer = OutputLayer{Layer:layer}
		}

		if i==0 {
			currentLayer.SetPrev(nil)
		} else {
			currentLayer.SetPrev(prevLayer)
			prevLayer.SetNext(currentLayer)
		}

		net.layers[i] = currentLayer
		prevLayer = currentLayer
	}

	for i := range net.layers {
		net.layers[i].Prepare()
	}
}

func (net Net) GetSize() []int {
	return net.size
}

func (net Net) String() string {
	return fmt.Sprintf("Convnet")
}