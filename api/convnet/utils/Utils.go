package utils

import(
	"math"
)

func Sigmoid(x float64) float64 {
	return 1/(1+math.Exp(-x))
}

func DSigmoid(x float64) float64 {
	y := Sigmoid(x)
	return y * (1 - y)
}
