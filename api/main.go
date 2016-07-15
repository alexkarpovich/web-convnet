package main

import (
	//"fmt"
	"os"
	"image/jpeg"
	"github.com/alexkarpovich/convnet/api/convnet"
	"github.com/alexkarpovich/convnet/api/convnet/interfaces"
	"image"
)

func LoadImages(examples map[string][]float64) map[image.Image][]float64 {
	result := make(map[image.Image][]float64)

	for path, label := range examples {
		fImg, _ := os.Open(path)
		defer fImg.Close()
		img, _ := jpeg.Decode(fImg)

		result[img] = label
	}

	return result
}

func main() {
	cnn := &convnet.Net{}
	cnn.Init()

	examples := map[string][]float64{
		"images/cat1.jpg":[]float64{1,0},
		"images/cat3.jpg":[]float64{1,0},
		"images/cat4.jpg":[]float64{1,0},
		"images/dog2.jpg":[]float64{0,1},
		"images/dog3.jpg":[]float64{0,1},
		"images/dog4.jpg":[]float64{0,1},
	}

	trainingSet := LoadImages(examples)
	trainParams := interfaces.TrainParams{MaxIteration:1000, MinError: 0.01}
	cnn.Train(trainParams, trainingSet)
}
