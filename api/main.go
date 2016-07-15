package main

import (
	"fmt"
	"os"
	"image"
	"image/jpeg"
	"github.com/alexkarpovich/convnet/api/convnet"
	"github.com/alexkarpovich/convnet/api/convnet/interfaces"
	. "github.com/petar/GoMNIST"
)

func LoadImage(path string) image.Image {
	fImg, _ := os.Open(path)
	defer fImg.Close()
	img, _ := jpeg.Decode(fImg)

	return img
}

func LoadImages(examples map[string][]float64) map[image.Image][]float64 {
	result := make(map[image.Image][]float64)

	for path, label := range examples {
		img := LoadImage(path)

		result[img] = label
	}

	return result
}

func main() {
	cnn := &convnet.Net{}
	cnn.Init()

	//examples := map[string][]float64{
	//	"images/cat1.jpg":[]float64{1,0},
	//	"images/cat3.jpg":[]float64{1,0},
	//	"images/cat4.jpg":[]float64{1,0},
	//	"images/dog2.jpg":[]float64{0,1},
	//	"images/dog3.jpg":[]float64{0,1},
	//	"images/dog4.jpg":[]float64{0,1},
	//}

	trainingSet, _,  err := Load("/home/aliaksandr/dev/gopacks/src/github.com/petar/GoMNIST/data")
	if err != nil {
		fmt.Println(err)
	}

	//trainingSet := LoadImages(examples)
	trainParams := interfaces.TrainParams{MaxIteration:1000, MinError: 0.01}
	cnn.Train(trainParams, trainingSet)
}
