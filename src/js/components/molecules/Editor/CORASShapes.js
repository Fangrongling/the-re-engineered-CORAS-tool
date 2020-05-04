function AddCorasShapes(joint) {
    joint.dia.Element.define("coras.unboxedElement", {
        attrs: {
            linkHandler: {
                refWidth: "160%",
                refHeight: "120%",
                fill: "#FFF",
                refX: "-40%",
                refY: "-15%",
                magnet: true
            },
            text: {
                text: "Asset",
                refX: "50%",
                refY: "100%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
            likelihood:{
                text: "",
                refX: "50%",
                refY: "-35%",
                textAnchor: "middle",
                textVerticalAnchor: "top"
            }, 
            likelihood2:{
                text: "",
                refX: "-15%",
                refY: "-35%",
                textAnchor: "middle",
                textVerticalAnchor: "top"
            },
            likelihood3:{
                text: "",
                refX: "-15%",
                refY: "-35%",
                textAnchor: "middle",
                textVerticalAnchor: "top"
            },
            years:{
                text: "",
                refX: "75%",
                refY: "-35%",
                textAnchor: "middle",
                textVerticalAnchor: "top"
            },
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "linkHandler"
            },
            {
                tagName: "image",
                selector: "icon",
            },
            {
                tagName: "text",
                selector: "text",
            },
            {
                tagName: "text",
                selector: "likelihood"
            },
            {
                tagName: "text",
                selector: "likelihood2"
            },
            {
                tagName: "text",
                selector: "likelihood3"
            },
            {
                tagName: "text",
                selector: "years"
            },
        ]
    });
    joint.dia.Element.define("coras.ellipseElement", {
        attrs: {
            body: {
                refCx: "50%",
                refCy: "50%",
                refRx: "50%",
                refRy: "50%",
                fill: "#fff",
                stroke: "#000",
                magnet: true
            },
            innerBody: {
                refCx: "50%",
                refCy: "50%",
                refRx: "45%",
                refRy: "45%",
                fill: "#FFF",
            },
            icon: {
                refWidth: "40%",
                refHeight: "40%",
                refX: "30%",
                refY: "-25%",
            },
            text: {
                refX: "50%",
                refY: "50%",
                textVerticalAnchor: 'middle',
                textAnchor: 'middle'
            },
            likelihood:{
                text: "",
                refX: "50%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
            likelihood2:{
                text: "",
                refX: "20%",
                refY: "95%",
                textAnchor: "start",
                textVerticalAnchor: "bottom"
            },
            likelihood3:{
                text: "",
                refX: "58%",
                refY: "95%",
                textAnchor: "end",
                textVerticalAnchor: "bottom"
            },
            years:{
                text: "",
                refX: "77%",
                refY: "95%",
                textAnchor: "end",
                textVerticalAnchor: "bottom"
            },
            frame2:{
                text: "",
                refX: "51%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
        }
    }, {
        markup: [
            {
                tagName: "ellipse",
                selector: "body"
            },
            {
                tagName: "ellipse",
                selector: "innerBody"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            },
            {
                tagName: "text",
                selector: "likelihood"
            },
            {
                tagName: "text",
                selector: "likelihood2"
            },
            {
                tagName: "text",
                selector: "likelihood3"
            },
            {
                tagName: "text",
                selector: "years"
            },
            {
                tagName: "text",
                selector: "frame2"
            },
        ]
    });
    joint.dia.Element.define("coras.rectElement", {
        attrs: {
            body: {
                refX: "0",
                refY: "0",
                refWidth: "100%",
                refHeight: "100%",
                fill: "#FFF",
                stroke: "#000",
                magnet: true
            },
            innerBody: {
                refX: "5%",
                refY: "5%",
                refWidth: "90%",
                refHeight: "90%",
                fill: "#FFF"
            },
            icon: {
                refWidth: "50%",
                refHeight: "50%",
                refX: "75%",
                refY: "-25%"
            },
            text: {
                refX: "50%",
                refY: "50%",
                textVerticalAnchor: "middle",
                textAnchor: "middle"
            },
            likelihood:{
                text: "",
                refX: "50%",
                refY: "90%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
            likelihood2:{
                text: "",
                refX: "20%",
                refY: "95%",
                textAnchor: "start",
                textVerticalAnchor: "bottom"
            },
            likelihood3:{
                text: "",
                refX: "58%",
                refY: "95%",
                textAnchor: "end",
                textVerticalAnchor: "bottom"
            },
            years:{
                text: "",
                refX: "77%",
                refY: "95%",
                textAnchor: "end",
                textVerticalAnchor: "bottom"
            },
            frame2:{
                text: "",
                refX: "51%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },/*
            likelihood2:{
                text: "",
                refX: "35%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
            likelihood3:{
                text: "",
                refX: "35%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
            years:{
                text: "",
                refX: "55%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            },
            frame2:{
                text: "",
                refX: "51%",
                refY: "95%",
                textAnchor: "middle",
                textVerticalAnchor: "bottom"
            }*/
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "body"
            },
            {
                tagName: "rect",
                selector: "innerBody"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            },
            {
                tagName: "text",
                selector: "likelihood"
            },
            {
                tagName: "text",
                selector: "likelihood2"
            },
            {
                tagName: "text",
                selector: "likelihood3"
            },
            {
                tagName: "text",
                selector: "years"
            },    
            {
                tagName: "text",
                selector: "frame2"
            },  
        ]
    });
}

export default AddCorasShapes;
