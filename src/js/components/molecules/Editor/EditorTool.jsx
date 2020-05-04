import React from 'react';
import { connect } from 'react-redux';
import { ToolElementClicked, ToolTabSelected } from '../../../store/Actions';
import './editortool.css';
import index from 'jss';
//import Tooltip from './Tooltip';

const Tooltip = ({text1, text2, tip}) =>
    <div className="tooltiptext" style={{display:tip}}>
        <p>{text1}<br/><br/>{text2}</p>
    </div>;

const EditorToolBar = ({ beginMoveElement, svgs}) =>
    <div className="editor-toolbox" >
        {svgs ?
            svgs.map((svg, i) =>
                <div className="editor-toolbox__element"
                draggable
                onDragStart={(e) => {
                    const shape = svg.shapeFn();
                    if(svg.attrs)
                        Object.keys(svg.attrs).map((key, index) => shape.attr(key, svg.attrs[key]));

                    const styles = svg.typeStyles[svg.corasType];
                    Object.keys(styles).forEach((ref) => shape.attr(ref, styles[ref]));
                    shape.attr("text/text", svg.text);                   
                    shape.set('corasType', svg.corasType);
                    shape.set('relation', svg.relation);                    
                    shape.set('typeStyles', svg.typeStyles);
                    //shape.set('independent', svg.independent);
                    beginMoveElement(shape, svg.width, svg.height)
                }}
                key={i} >
                    <img src={svg.typeStyles[svg.corasType]["icon/href"]} height={svg.iconHeight || 40} className="editor-toolbox__icon" />
                    <div>{svg.text}</div>
                </div>) :
            null}
       
    </div>;

const ToolBar = ({ beginMoveElement, toolDefinitions, selectedTab, selectTab}) =>
    <div className="editor-tools">
        <div className="editor-tabrow">
            {toolDefinitions.map((toolDefinition, i) => 
                <a onClick={() => selectTab(i)} key={i} className="editor-tabrow__tablink">
                    <div className={`editor-tabrow__tab${i === selectedTab ? " editor-tabrow__tab--selected" : ""}`}>{toolDefinition.name}</div>
                </a>)}
        </div>
        <EditorToolBar beginMoveElement={beginMoveElement} svgs={toolDefinitions[selectedTab].shapes}/>
    </div>;

class EditorTool extends React.Component {
    constructor(props) {
        super(props);
        this.changeDisplay = this.changeDisplay.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        
        this.state = {
            show: false,
            tip: 'none',
        }
    }
    
    changeDisplay(){
        this.setState({
            show: !this.state.show,
        })
    }

    handleMouseOver(e){
        this.setState({
                tip: 'block',
              });
        /*setTimeout(() => {
            this.setState({
                tip: 'block',
              });
        }, 3000);*/
    }

    handleMouseOut(e){
        this.setState({
            tip: 'none',
        });
    }

    render() {
        return (
            <div>
                {this.state.show ? 
                    <div className="toolbarShow" style={{position:'fixed', right:'-45px', top:'98px'}}>
                        <button className="editor-menu__button" onClick={this.changeDisplay} >&or; Show Tool Bar</button>                
                    </div>
                : 
                <div className="" >
                    <div className="toolbarHide" style={{position:'fixed', right:'202px', top:'98px'}}>
                        <button className="editor-menu__button" onClick={this.changeDisplay} >&and; Hide Tool Bar</button>
                        <img src="https://scontent.fosl1-1.fna.fbcdn.net/v/t1.0-9/93871436_2925620574187163_6103613672574156800_n.jpg?_nc_cat=104&_nc_sid=8024bb&_nc_ohc=nafxUbJbOcoAX9BWWwU&_nc_ht=scontent.fosl1-1.fna&oh=24ee1ecd5881cd4cedd8944068584a9e&oe=5EC58F08" alt="" 
                        style={{width: '23px',margin: '-10px',transform:'rotate(270deg)'}} onMouseOver={this.handleMouseOver}
                        onMouseLeave={this.handleMouseOut}/>
                    </div>
                    <Tooltip text1="- Draw by dragging the icon onto the drawing paper." text2="- Double-click or right-click on the elements on the drawing paper to edit its information" tip={this.state.tip}/>                    
                    <ToolBar beginMoveElement={this.props.beginMoveElement} toolDefinitions={this.props.toolDefinitions} selectedTab={this.props.selectedTab} selectTab={this.props.selectTab}/>
                </div>
                }
                
                {console.log(this.state.tip)}
           
            </div>
        );

    }
}

export default connect((state) => ({
    selectedTab: state.editor.editorToolSection
}), (dispatch) => ({
    beginMoveElement: (element, width, height) => dispatch(ToolElementClicked(element, width, height)),
    selectTab: (tabNo) => dispatch(ToolTabSelected(tabNo))
}))(EditorTool);
