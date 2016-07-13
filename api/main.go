package main

import (
	//"fmt"
	"os"
	"image/jpeg"
	"github.com/alexkarpovich/convnet/api/convnet"
)

func main() {
	cnn := &convnet.Net{}
	cnn.Init()

	fImg1, _ := os.Open("images/cat1.jpg")
	defer fImg1.Close()
	img1, _ := jpeg.Decode(fImg1)

	cnn.Test(img1)
}
