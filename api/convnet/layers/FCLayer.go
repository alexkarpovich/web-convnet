package layers

import (
	"fmt"
)

type FCLayer struct {
	*Layer
}

func (l FCLayer) Prepare() {
	fmt.Println(l.class)

}

func (l FCLayer) FeedForward() {

}

func (l FCLayer) BackProp() {

}
