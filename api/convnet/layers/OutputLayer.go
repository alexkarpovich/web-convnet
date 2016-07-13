package layers

import (
	"fmt"
)

type OutputLayer struct {
	*Layer
}

func (l *OutputLayer) Prepare() {
	fmt.Println(l.class)
}

func (l *OutputLayer) FeedForward() {

}

func (l *OutputLayer) BackProp() {

}

func (l *OutputLayer) GetProp(name string) interface{} {
	switch name {
	case "outSize": return l.size
	}

	return nil
}
