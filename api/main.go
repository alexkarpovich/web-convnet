package main

import (
	"fmt"
	"github.com/alexkarpovich/convnet/api/convnet"
)

func main() {
	cnn := convnet.Net{}
	cnn.Init()

	fmt.Println(cnn)
}
