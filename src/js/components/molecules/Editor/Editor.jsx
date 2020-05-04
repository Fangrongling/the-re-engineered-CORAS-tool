import React from 'react';
import joint from 'jointjs';
import { connect } from 'react-redux';
import {
    ElementRightClicked,
    ElementDoubleClicked,
    ElementEditorCancel,
    ElementEditorSave,
    ElementEditorDelete,
    ElementEditorReset,
    ElementLabelEdit,
    ElementLikelihoodEdit,
    ElementLikelihoodEdit2,
    ElementLikelihoodEdit3,
    ElementCalculation,
    ElementYears,
    ElementChangeX,
    ElementChangeY,
    ElementChangeType,
    ElementChangeRelation,
    ToolElementRelease,
    MenuClearClicked,
    MenuClearConfirmed,
    CellClicked,
    CellHandleClicked,
    CellHandleRelased,
    CellHandleMoved,
} from '../../../store/Actions';

import{
    assetSymbol,
    indirectAssetSymbol,
    riskSymbol,
    threatHumanAccidentalSymbol,
    threatHumanDeliberateSymbol,
    threatNonHumanSymbol,
    stakeholderSymbol,
    treatmentSymbol,
    unwantedIncidentSymbol,
    vulnerabilitySymbol,
} from './svg//CorasSymbolsBase64.js';

import Modal from '../../atoms/Modal/Modal';

import ElementEditor from './ElementEditor';
import EditorTool from './EditorTool';
import CellTool from './CellTool';
import CORASCalculation from "./CORASCalculation";


import "../../../../../node_modules/jointjs/dist/joint.css";
import './editor.css';

import AddCorasShapes from './CORASShapes.js';
import ToolDefinitions from './ToolDefinitions';

AddCorasShapes(joint);

class EditorView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div></div>);
    }
}

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.graph = new joint.dia.Graph();

        this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
        this.getFromLocalStorage = this.getFromLocalStorage.bind(this);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleScrollBlank = this.handleScrollBlank.bind(this);
        //this.handleZoom = this.handleZoom.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.offsetToLocalPoint = this.offsetToLocalPoint.bind(this);

        this.beginMovePaper = this.beginMovePaper.bind(this);
        this.movePaper = this.movePaper.bind(this);
        this.endMovePaper = this.endMovePaper.bind(this);
        this.updatePaperSize = this.updatePaperSize.bind(this);
        this.removeLink = this.removeLink.bind(this);
        this.cellToolHandleMoved = this.cellToolHandleMoved.bind(this);

        this.paperOnMouseUp = this.paperOnMouseUp.bind(this);

        this.saveGraphToFile = this.saveGraphToFile.bind(this);
        this.loadGraphFromFile = this.loadGraphFromFile.bind(this);
        this.clearGraph = this.clearGraph.bind(this);
        this.downloadSvg = this.downloadSvg.bind(this);
        this.valueReset = this.valueReset.bind(this);
        this.onCalculationChange = this.onCalculationChange.bind(this);

        this.paperId = this.props.paperId || 'paper-holder';
        this.paperWrapperId = `${this.paperId}-wrapper`;

        this.loadRef = React.createRef();
        this.paperRef = React.createRef();

        /*this.state = {
            isProb: true,
        }*/
    }

    saveToLocalStorage() {
        window.localStorage.setItem(this.paperId + "graph", JSON.stringify(this.graph.toJSON()))
    }

    getFromLocalStorage() {
        return window.localStorage.getItem(this.paperId + "graph");
    }

    componentDidMount() {
        const arrowheadShape = 'M 10 0 L 0 5 L 10 10 z';

        this.paper = new joint.dia.Paper({
            el: document.getElementById(this.paperId),
            model: this.graph,
            width: document.getElementById(this.paperWrapperId).offsetWidth - 10,
            height: document.getElementById(this.paperWrapperId).offsetHeight - 10,
            gridSize: 1,
            background: {
                color: 'rgba(255, 255, 255, 1)',
            },
            interactive: this.props.interactive === undefined ? true : this.props.interactive,
            defaultLink: new joint.shapes.devs.Link({
                attrs: {
                    '.marker-target': {
                        d: arrowheadShape
                    },
                },
            }),
            linkPinning: false,   // The connection must be connected to an element, that is, it is not allowed to connect to the blank
        
            //Connection restriction
            validateConnection: (viewSource, magnetSource, viewTarget, magnetTarget, end, viewLink) => {

                //Symbols asset can only point to symbols asset, and can be only pointed by symbols incident.
                if((viewSource.model.attr("icon/href") === assetSymbol && viewTarget.model.attr("icon/href") === assetSymbol) ||
                (viewSource.model.attr("icon/href") === assetSymbol && viewTarget.model.attr("icon/href") === indirectAssetSymbol) ||
                (viewSource.model.attr("icon/href") === indirectAssetSymbol && viewTarget.model.attr("icon/href") === assetSymbol) ||
                (viewSource.model.attr("icon/href") === indirectAssetSymbol && viewTarget.model.attr("icon/href") === indirectAssetSymbol)){
                    return true; 
                }else if((viewTarget.model.attr("icon/href") === assetSymbol && viewSource.model.attr("icon/href") === unwantedIncidentSymbol)||
                (viewTarget.model.attr("icon/href") === indirectAssetSymbol && viewSource.model.attr("icon/href") === unwantedIncidentSymbol)){
                    return true;
                }

                //Symbols threat can only point to threat scenario, vulnerability and incident.
                else if((viewSource.model.attr("icon/href") === threatHumanAccidentalSymbol && viewTarget.model.attr("icon/href") === riskSymbol) ||
                (viewSource.model.attr("icon/href") === threatHumanDeliberateSymbol && viewTarget.model.attr("icon/href") === riskSymbol) ||
                (viewSource.model.attr("icon/href") === threatNonHumanSymbol && viewTarget.model.attr("icon/href") === riskSymbol) ||
                (viewSource.model.attr("icon/href") === threatHumanAccidentalSymbol && viewTarget.model.attr("icon/href") === vulnerabilitySymbol) ||
                (viewSource.model.attr("icon/href") === threatHumanDeliberateSymbol && viewTarget.model.attr("icon/href") === vulnerabilitySymbol) ||
                (viewSource.model.attr("icon/href") === threatNonHumanSymbol && viewTarget.model.attr("icon/href") === vulnerabilitySymbol) ||
                (viewSource.model.attr("icon/href") === threatHumanAccidentalSymbol && viewTarget.model.attr("icon/href") === unwantedIncidentSymbol) ||
                (viewSource.model.attr("icon/href") === threatHumanDeliberateSymbol && viewTarget.model.attr("icon/href") === unwantedIncidentSymbol) ||
                (viewSource.model.attr("icon/href") === threatNonHumanSymbol && viewTarget.model.attr("icon/href") === unwantedIncidentSymbol)){
                    return true;
                }

                //Threat scenario can only ponit to incident.
                else if((viewSource.model.attr("icon/href") === riskSymbol && viewTarget.model.attr("icon/href") === riskSymbol) ||
                (viewSource.model.attr("icon/href") === riskSymbol && viewTarget.model.attr("icon/href") === unwantedIncidentSymbol) ||
                (viewSource.model.attr("icon/href") === riskSymbol && viewTarget.model.attr("icon/href") === vulnerabilitySymbol)){
                    return true;
                }

                //Incident can only point to incident and asset.
                else if((viewSource.model.attr("icon/href") === unwantedIncidentSymbol && viewTarget.model.attr("icon/href") === assetSymbol) ||
                (viewSource.model.attr("icon/href") === unwantedIncidentSymbol && viewTarget.model.attr("icon/href") === unwantedIncidentSymbol)){
                    return true;
                }

                //Symbol vulnerability can point to threat scenario.
                else if((viewSource.model.attr("icon/href") === vulnerabilitySymbol && viewTarget.model.attr("icon/href") === riskSymbol)){
                    return true;
                }

                //Symbol treatment can only point to threat scenario and vulnerability.
                else if((viewSource.model.attr("icon/href") === treatmentSymbol && viewTarget.model.attr("icon/href") === riskSymbol) ||
                (viewSource.model.attr("icon/href") === treatmentSymbol && viewTarget.model.attr("icon/href") === vulnerabilitySymbol) ||
                (viewSource.model.attr("icon/href") === treatmentSymbol && viewTarget.model.attr("icon/href") === unwantedIncidentSymbol) ||
                (viewSource.model.attr("icon/href") === treatmentSymbol && viewTarget.model.attr("icon/href") === threatHumanAccidentalSymbol) ||
                (viewSource.model.attr("icon/href") === treatmentSymbol && viewTarget.model.attr("icon/href") === threatHumanDeliberateSymbol) ||
                (viewSource.model.attr("icon/href") === treatmentSymbol && viewTarget.model.attr("icon/href") === threatNonHumanSymbol)){
                    return true;
                }

                else return false;
            }
        });

        // Load graph from localStorage or props
        if (this.getFromLocalStorage()) this.graph.fromJSON(JSON.parse(this.getFromLocalStorage()));
        else if (this.props.initialDiagram) this.graph.fromJSON(this.props.initialDiagram);

        // Save in localStorage on change (or rather, every second currently)
        this.periodicalSave = setInterval(this.saveToLocalStorage, 1000);

        window.addEventListener('resize', this.updatePaperSize);

        if (this.props.interactive === undefined ? true : this.props.interactive) {
            this.paper.on('cell:contextmenu', (elementView, e, x, y) => this.props.elementDoubleClicked(elementView.model, e)); //ulike elementer
            this.paper.on('cell:pointerdblclick', (elementView, e, x, y) => this.props.elementDoubleClicked(elementView.model, e));

            //this.paper.on('cell:mousewheel', this.handleScroll);
            //this.paper.on('blank:mousewheel', this.handleScrollBlank);

            this.paper.on('blank:pointerdown', this.beginMovePaper);
            this.paper.on('blank:pointermove', this.movePaper);
            this.paper.on('blank:pointerup', this.endMovePaper);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updatePaperSize);
        clearInterval(this.periodicalSave);
    }

    handleScroll(cellView, e, x, y, delta) {
        const scaleFactor = 1.01;
        const currentScale = this.paper.scale();
        //console.log(e.originalEvent.wheelDelta);
        if (delta > 0) {
            const newX = currentScale.sx * scaleFactor > 2 ? currentScale.sx : currentScale.sx * scaleFactor;
            const newY = currentScale.sy * scaleFactor > 2 ? currentScale.sy : currentScale.sy * scaleFactor;
            this.paper.scale(newX, newY);
        } else if (delta < 0) {
            const newX = currentScale.sx / scaleFactor < 0.52 ? currentScale.sx : currentScale.sx / scaleFactor;
            const newY = currentScale.sy / scaleFactor < 0.52 ? currentScale.sy : currentScale.sy / scaleFactor;
            //this.paper.translate(newX, newY);
            this.paper.scale(newX, newY);
        }
        /*e.preventDefault();
        e = e.originalEvent;
      
        delta = delta / 50;
        var localPoint = this.offsetToLocalPoint(x, y);
      
        var newScale = joint.V(this.paper.viewport).scale().sx + delta; // the current paper scale changed by delta
      
        if (newScale > 0.5 && newScale < 2) {
          //this.paper.setOrigin(0, 0); // reset the previous viewport translation
          this.paper.translate(0, 0); // setOrigin is deprecated, replaced by translate
          this.paper.scale(newScale, newScale, localPoint.x, localPoint.y); //p.x, p.y);
        }*/
    }

    handleZoomIn() {
        const scaleFactor = 1.15;
        const currentScale = this.paper.scale();

        const newX = currentScale.sx * scaleFactor > 2 ? currentScale.sx : currentScale.sx * scaleFactor;
        const newY = currentScale.sy * scaleFactor > 2 ? currentScale.sy : currentScale.sy * scaleFactor;
        this.paper.scale(newX, newY);
    }

    handleZoomOut() {
        const scaleFactor = 1.15;
        const currentScale = this.paper.scale();

        const newX = currentScale.sx / scaleFactor < 0.52 ? currentScale.sx : currentScale.sx / scaleFactor;
        const newY = currentScale.sy / scaleFactor < 0.52 ? currentScale.sy : currentScale.sy / scaleFactor;
        this.paper.scale(newX, newY);
    }

    offsetToLocalPoint(offsetX, offsetY) {
        var svgPoint = this.paper.svg.createSVGPoint();
        svgPoint.x = offsetX;
        svgPoint.y = offsetY;
        var offsetTransformed = svgPoint.matrixTransform(this.paper.viewport.getCTM().inverse());
        return offsetTransformed
    }

    handleScrollBlank(e, x, y, delta) {
        this.handleScroll(null, e, x, y, delta);
    }

    beginMovePaper(e, x, y) {
        this.setState({ paperMove: { moving: true, x, y } });
    }

    movePaper(e, x, y) {
        if (this.state.paperMove.moving) {
            const { tx, ty } = this.paper.translate();
            this.paper.translate(tx + (x - this.state.paperMove.x), ty + (y - this.state.paperMove.y));
        }
    }

    endMovePaper(e, x, y) {
        this.setState({ paperMove: { moving: false } })
    }

    updatePaperSize() {
        this.paper.setDimensions(
            document.getElementById(this.paperWrapperId).offsetWidth - 10,
            document.getElementById(this.paperWrapperId).offsetHeight - 10);
    }

    removeLink(elementView, e, x, y) {
        if (!this.state.linkToRemove) this.setState({ linkToRemove: elementView });
        else if (this.state.linkToRemove === elementView) {
            this.setState({ linkToRemove: null });
            elementView.model.remove();
        } else this.setState({ linkToRemove: null });
    }

    paperOnMouseUp(e) {
        e.preventDefault();
        const localPoint = this.paper.pageToLocalPoint(e.pageX, e.pageY);
        this.props.elementDropped(this.graph, localPoint.x, localPoint.y);
    }

    saveGraphToFile(e) {
        e.preventDefault();
        const a = document.createElement('a');
        const graphContent = new Blob([JSON.stringify(this.graph.toJSON(), null, 2)], { type: 'text/plain' });
        a.href = URL.createObjectURL(graphContent);
        a.download = "CORASDiagram.json";
        a.click();
        a.remove();
    }

    loadGraphFromFile(e) {
        const filePath = e.target;        
        const reader = new FileReader();
        if (filePath.files && filePath.files[0]) {
            reader.readAsText(filePath.files[0]);            
            reader.addEventListener('load', (e) => this.graph.fromJSON(JSON.parse(e.target.result),console.log(e)), { once: true });
            filePath.value = "";
        }
    }

    clearGraph(e) {
        this.graph.clear();
        window.localStorage.removeItem(this.paperId + "graph");
        if (this.props.initialDiagram) this.graph.fromJSON(this.props.initialDiagram);
        this.props.clearConfirmed();
    }

    downloadSvg() {
        let svgElement = this.paper.svg;

        // Remove link tools from downloaded SVG
        const toolElems = svgElement.getElementsByClassName("link-tools");
        const arrowElems = svgElement.getElementsByClassName("marker-arrowhead");

        const toolArray = Array.from(toolElems);
        const arrowArray = Array.from(arrowElems);

        toolArray.forEach((elem) => elem.remove());
        arrowArray.forEach((elem) => elem.remove());

        // Add other standard font
        svgElement.style.fontFamily = "Oswald, sans-serif";

        //get svg source.
        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        // Fix svg size
        let search = /(<svg xmlns="\S*" xmlns:xlink="\S*" version="\S*" id="\S*" width=)\S*( height=)\S*(>)/gm;
        let replace = `$1"${this.paperRef.current.offsetWidth}px"$2"${this.paperRef.current.offsetHeight}px"$3`
        source = source.replace(search, replace);

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        let a = document.createElement('a');
        a.href = url;
        a.download = 'CORASDiagram.svg';
        a.click();
        a.remove();
    }

    valueReset(e){
        e.preventDefault();
        for(const element of this.graph.getCells()){
            if(element.isLink()){
                element.attr('likelihood/text', ""); 
                element.attr('likelihood2/text', ""); 
                element.attr('likelihood3/text', ""); 
                element.attr('years/text', '');                                                                  
                element.labels([{attrs:{text:{text:""}}}]);
            }else{
                element.attr('likelihood2/text', "");
                element.attr('likelihood3/text', "");                  
                element.attr('frame2/text', '');                  
                element.attr('years/text', '');                                  
                element.attr('likelihood/text', ""); 
                element.attr('body/stroke', "#000"); 
            }
        }
    }

    onCalculationChange(e){
        e.preventDefault();
        //console.log(this.props.isProb);
        this.props.elementEditorCalculation(!this.props.isProb);
        this.setState({ isProb: !this.props.isProb });
        if(this.props.isProb){

        }else{

        }
    }

    cellToolHandleMoved(e) {
        const { pageX, pageY } = e;

        const newHeight = pageY - (this.props.cellTool.position.y + this.props.cellToolHeight) + this.props.cellToolHeight;

        if(this.props.cellTool.handleHeld) this.props.cellHandleMoved(this.props.cellToolWidth, newHeight);
    }

    render() {
        return (
            <div className="editor-wrapper">
                <EditorMenu
                    loadStartFn={() => this.loadRef.current.click()}
                    loadFn={this.loadGraphFromFile}
                    loadRef={this.loadRef}
                    saveFn={this.saveGraphToFile}
                    clearFn={this.clearGraph}
                    showClearModal={this.props.showClearModal}
                    clearPosition={this.props.clearPosition}
                    clearClicked={this.props.clearClicked}
                    downloadFn={this.downloadSvg} 
                    graph={this.graph}
                    reset={this.valueReset}
                    calculationChange={this.onCalculationChange}
                    isProb={this.props.isProb} 
                    zoomIn={this.handleZoomIn}
                    zoomOut={this.handleZoomOut}                   
                    />


                {this.props.elementEditor.visible ? 
                    <ElementEditor
                        {...this.props.elementEditor.data}
                        cancel={this.props.elementEditorCancel}
                        save={this.props.elementEditorSave}
                        delete={this.props.elementEditorDelete}
                        reset={this.props.elementEditorReset}
                        labelOnChange={this.props.elementEditorLabelEdit}
                        likelihoodOnChange={this.props.elementEditorLikelihoodEdit}
                        likelihoodOnChange2={this.props.elementEditorLikelihoodEdit2}
                        likelihoodOnChange3={this.props.elementEditorLikelihoodEdit3}
                        yearsOnChange={this.props.elementEditorYears}
                        isProbability={this.props.elementEditorCalculation}
                        xOnChange={this.props.elementEditorChangeX}
                        yOnChange={this.props.elementEditorChangeY}
                        typeOnChange={this.props.elementEditorChangeType}
                        relationOnChange={this.props.elementEditorChangeRelation}
                        prob={this.props.isProb} 
                        source={this.props.elementEditor.data.isLink? this.graph.getCell(this.props.elementEditor.data.element.get('source').id) : this.props.elementEditor.data.element}
                        target={this.props.elementEditor.data.isLink? this.graph.getCell(this.props.elementEditor.data.element.get('target').id) : this.props.elementEditor.data.element}/>
                : null}
                <div
                    id={this.paperWrapperId}
                    className="editor-paper"
                    onDragEnter={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={this.paperOnMouseUp}
                    style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}
                    ref={this.paperRef} >
                    <div id={this.paperId}></div>
                </div>


                {this.props.interactive || this.props.interactive === undefined ?
                    <EditorTool toolDefinitions={ToolDefinitions} /> : null}
            </div>);
    }
}



const EditorMenu = ({ loadStartFn, loadRef, loadFn, saveFn, clearFn, showClearModal, clearClicked, clearPosition, downloadFn, calculationChange, isProb, graph, reset, zoomIn, zoomOut}) =>
    <div className="editor-menu">
        <button className="editor-menu__button" onClick={loadStartFn}>Load</button>
        <input type="file" name="loadFile" label="Load" className="editor-menu__hidden" onChange={loadFn} ref={loadRef} />
        <button className="editor-menu__button" onClick={saveFn}>Save</button>
        <button className="editor-menu__button" onClick={clearClicked}>Clear</button>
        <Modal isOpen={showClearModal} noBackground={true} position={clearPosition}>
            <div className="editor-clear-modal">
                <div className="editor-clear-modal__description">Are you sure you want to clear the diagram?</div>
                <button className="editor-clear-modal__button editor-clear-modal__button--danger" onClick={clearFn}>Yes, clear</button>
                <button className="editor-clear-modal__button editor-clear-modal__button" onClick={clearClicked}>No, cancel</button>
            </div>
        </Modal>
        <button className="editor-menu__button" onClick={downloadFn}>Download (SVG)</button>
        <button className="editor-menu__button" onClick={reset}>Likelihood Reset</button>
        <CORASCalculation isProb={isProb} graph={graph}/>        
        <div class="testswitch" onClick={calculationChange}>
            {isProb ? [
                <input class="testswitch-checkbox" id="onoffswitch" type="checkbox" />,
                
            ]:[
                <input class="testswitch-checkbox" id="onoffswitch" type="checkbox" checked/>,                      
            ]}
            <label class="testswitch-label" for="onoffswitch">
                <span class="testswitch-inner" data-on="Frequency" data-off="Probability"></span>
                <span class="testswitch-switch"></span>
            </label>
        </div>  
        <div className="zoom">
            <button className="zoom_button" onClick={zoomIn}>+</button>
            <button className="zoom_button" onClick={zoomOut}>-</button>
        </div>     
    </div>;



export default connect((state) => ({
    elementEditor: state.editor.elementEditor,
    showClearModal: state.editor.editorMenu.showClearModal,
    clearPosition: state.editor.editorMenu.clearPosition,
    cellTool: state.editor.cellTool,
    cellToolWidth: state.editor.cellTool.size.width,
    cellToolHeight: state.editor.cellTool.size.height,
    isProb: state.editor.isProb
}), (dispatch) => ({
    elementRightClicked: (element, graph) => dispatch(ElementRightClicked(element, graph)),
    elementDoubleClicked: (element, event) => dispatch(ElementDoubleClicked(element, event)),
    elementEditorCancel: () => dispatch(ElementEditorCancel()),
    elementEditorSave: (label) => dispatch(ElementEditorSave(label)),
    elementEditorDelete: () => dispatch(ElementEditorDelete()),
    elementEditorReset: (element) => dispatch(ElementEditorReset(element)),
    elementEditorLabelEdit: (label) => dispatch(ElementLabelEdit(label)),
    elementEditorLikelihoodEdit: (likelihood) => dispatch(ElementLikelihoodEdit(likelihood)),
    elementEditorLikelihoodEdit2: (likelihood) => dispatch(ElementLikelihoodEdit2(likelihood)),
    elementEditorLikelihoodEdit3: (likelihood) => dispatch(ElementLikelihoodEdit3(likelihood)),
    elementEditorYears: (years) => dispatch(ElementYears(years)),
    elementEditorCalculation: (isProb) => dispatch(ElementCalculation(isProb)),    
    elementEditorChangeX: (x) => dispatch(ElementChangeX(x)),
    elementEditorChangeY: (y) => dispatch(ElementChangeY(y)),
    elementEditorChangeType: (type) => dispatch(ElementChangeType(type)),
    elementEditorChangeRelation: (i) => dispatch(ElementChangeRelation(i)),
    elementDropped: (graph, pageX, pageY) => dispatch(ToolElementRelease(graph, pageX, pageY)),
    clearClicked: (e) => dispatch(MenuClearClicked(e)),
    clearConfirmed: () => dispatch(MenuClearConfirmed()),
    cellClicked: (x, y, width, height) => dispatch(CellClicked(x, y, width, height)),
    cellHandleClicked: (handle) => dispatch(CellHandleClicked(handle)),
    cellHandleReleased: () => dispatch(CellHandleRelased()),
    cellHandleMoved: (width, height) => dispatch(CellHandleMoved(width, height))
}))(Editor);
 
