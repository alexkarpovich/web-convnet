package convnet

import (
	"fmt"
	"image"
	"github.com/alexkarpovich/convnet/api/convnet/config"
	. "github.com/alexkarpovich/convnet/api/convnet/layers"
)

type Net struct {
	size []int
	in []int
	out []float64
	layers []ILayer
}

func (net *Net) Init() {
	netConfig := config.GetNetConfig()
	net.size = netConfig.Size
	net.initLayers(netConfig.Layers)
}

func (net *Net) initLayers(layersConfig []config.Layer) {
	net.layers = make([]ILayer, len(layersConfig))
	var currentLayer, prevLayer ILayer

	for i := range layersConfig {
		lconf := layersConfig[i]
		layer := &Layer{}
		layer.Init(net, lconf.Class, lconf.Size)

		switch lconf.Class {
		case "conv":
			convLayer := &ConvLayer{Layer:layer}
			convLayer.Construct(lconf.Shape, lconf.Count)
			currentLayer = convLayer
			break
		case "pool": currentLayer = &PoolLayer{Layer:layer}
			break
		case "fc": currentLayer = &FCLayer{Layer:layer}
			break
		case "output": currentLayer = &OutputLayer{Layer:layer}
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

func (net *Net) Train() {

}

func (net *Net) Test(img image.Image) {
	bounds := img.Bounds()
	net.size = []int{bounds.Max.X, bounds.Max.Y}
	net.prepareInput(img)

	for i := range net.layers {
		net.layers[i].FeedForward()
	}
}

func (net *Net) GetSize() []int {
	return net.size
}

func (net *Net) SetOutput(output []float64) {
	net.out = output
}

func (net *Net) prepareInput(img image.Image) {
	net.in = make([]int, net.size[0] * net.size[1])

	for j:=0; j<net.size[1]; j++ {
		for i:=0; i<net.size[0]; i++ {
			r, g, b, _ := img.At(i, j).RGBA()
			net.in[i+net.size[0]*j] = int(0.2989*float64(r) + 0.5870*float64(g) + 0.1140*float64(b));
		}
	}
}

func (net *Net) String() string {
	return fmt.Sprintf("Convnet")
}