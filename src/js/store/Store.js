import { createStore, combineReducers } from 'redux';
import ActionTypes from './ActionTypes';
import joint from 'jointjs';
import _ from 'lodash';


const rootReducer = combineReducers({ editor: Editor });

function Editor(state, action) {
    if (state === undefined) return {
        editorToolSection: 0,
        link: null,
        previousElementRightClicked: null,
        isProb: true,
        elementEditor: {
            visible: false,
            data: {
                isLink: false,
                editorPosition: {
                    left: 0,
                    top: 0
                },
                element: null,
                originalLabel: "",
                originalLikelihood: "",
                originalLikelihood2: "",
                originalLikelihood3: "",
                originalYears: "",
                label: "",
                likelihood: "",
                likelihood2: "",
                likelihood3: "",
                years: "",
                //isProb: true,
                originalPosition: {
                    x: 0,
                    y: 0
                },
                position: {
                    x: 0,
                    y: 0
                },
                type: 0,
                relation: false,
            }
        },
        movement: {
            element: null
        },
        editorMenu: {
            showClearModal: false,
            clearPosition: {
                top: "",
                left: ""
            }
        },
        cellTool: {
            open: false,
            position: {
                x: 0,
                y: 0
            },
            size: {
                width: 0,
                height: 0
            },
            handleHeld: false,
            handle: ""
        }
    };

    const newState = Object.assign({}, state);
    switch (action.type) {
        case ActionTypes.EDITOR.CREATE:
            return Object.assign({}, state);

        case ActionTypes.EDITOR.DROP_NEW_MODEL:
            return Object.assign({}, state);

        case ActionTypes.EDITOR.ADD_NEW_MODEL:
            return Object.assign({}, state);

        case ActionTypes.EDITOR.ELEMENT_RIGHT_CLICKED:
            if (!state.previousElementRightClicked) return Object.assign({}, state, { previousElementRightClicked: action.payload.element });
            else {
                const link = new joint.shapes.coras.link();
                link.set('corasType', 0);
                link.source(state.previousElementRightClicked);
                link.target(action.payload.element);
                link.addTo(action.payload.graph);
                return Object.assign({}, state, { previousElementRightClicked: null });
            }

        case ActionTypes.EDITOR.ELEMENT_DOUBLE_CLICKED:
            console.log(action.payload.element.attr('likelihood/text'));
            console.log(action.payload.element)
            
            return Object.assign({}, state, {
                elementEditor: {
                    visible: true,
                    originalLabel: action.payload.element.isLink() ? action.payload.element.attr('0.text/text') : action.payload.element.attr('text/text'),
                    originalLikelihood: action.payload.element.attr('likelihood/text'),
                    originalLikelihood2: action.payload.element.attr('likelihood2/text'),
                    originalLikelihood3: action.payload.element.attr('likelihood3/text'),
                    originalYears: action.payload.element.attr('years/text'),
                    originalIsProb: action.payload.element.get('isProb'),
                    originalPosition: action.payload.element.isLink() ? { x: null, y: null } : action.payload.element.position(),
                    data: {
                        isLink: action.payload.element.isLink(),
                        editorPosition: {
                            left: action.payload.event.pageX,
                            top: action.payload.event.pageY
                        },
                        element: action.payload.element,
                        label: action.payload.element.isLink() ?
                            action.payload.element.attr('0.text/text') :
                            _.get(action.payload.element, "0.attrs.text.text", ""),
                        likelihood: action.payload.element.attr('likelihood/text'), 
                        likelihood2: action.payload.element.attr('likelihood2/text'),
                        likelihood3: action.payload.element.attr('likelihood3/text'),
                        years:action.payload.element.attr('years/text'),
                        isProb:action.payload.element.get('isProb'),
                        position: action.payload.element.isLink() ? { x: null, y: null } : action.payload.element.position(),
                        type: parseInt(action.payload.element.get('corasType')),
                        relation: parseInt(action.payload.element.get('relation'))
                    }
                },
            });

        case ActionTypes.EDITOR.ELEMENT_CANCEL:
        if(state.isProb){
            if (state.elementEditor.data.isLink){
                if(state.elementEditor.originalLikelihood === undefined){
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:""}}}]);
                    console.log("original kong")
                    newState.elementEditor.data.element.attr('0.text/text', "");
                    newState.elementEditor.data.element.attr('likelihood/text', "");
                }else{
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:state.elementEditor.originalLikelihood}}}]);
                    newState.elementEditor.data.element.attr('0.text/text', state.elementEditor.originalLabel);
                    newState.elementEditor.data.element.attr('likelihood/text', state.elementEditor.originalLikelihood);
                }           
            }else{
                newState.elementEditor.data.element.attr('text/text', state.elementEditor.originalLabel);
                newState.elementEditor.data.element.attr('likelihood/text', state.elementEditor.originalLikelihood);
            }
        }else{
            if (state.elementEditor.data.isLink){
                if(state.elementEditor.originalLikelihood2 === undefined){
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:""}}}]);
                    console.log("original kong")
                    newState.elementEditor.data.element.attr('0.text/text', "");
                    newState.elementEditor.data.element.attr('likelihood2/text', "");
                    newState.elementEditor.data.element.attr('likelihood3/text', "");
                    newState.elementEditor.data.element.attr('years/text', "");
                }else if(state.elementEditor.originalLikelihood3 === undefined){
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:""}}}]);
                    newState.elementEditor.data.element.attr('0.text/text', "");
                    newState.elementEditor.data.element.attr('likelihood2/text', "");
                    newState.elementEditor.data.element.attr('likelihood3/text', "");
                    newState.elementEditor.data.element.attr('years/text', "");
                }else{
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:"[ "+state.elementEditor.originalLikelihood2+" - "+state.elementEditor.originalLikelihood3+" : "+state.elementEditor.originalYears+" ]"}}}]);
                    newState.elementEditor.data.element.attr('0.text/text', state.elementEditor.originalLabel);
                    newState.elementEditor.data.element.attr('likelihood/text', state.elementEditor.originalLikelihood);
                    newState.elementEditor.data.element.attr('likelihood2/text', state.elementEditor.originalLikelihood2);
                    newState.elementEditor.data.element.attr('likelihood3/text', state.elementEditor.originalLikelihood3);
                    newState.elementEditor.data.element.attr('years/text', state.elementEditor.originalYears);
                }           
        }else{
            newState.elementEditor.data.element.attr('text/text', state.elementEditor.originalLabel);
            newState.elementEditor.data.element.attr('likelihood/text', state.elementEditor.originalLikelihood);
            newState.elementEditor.data.element.attr('likelihood2/text', state.elementEditor.originalLikelihood2);
            newState.elementEditor.data.element.attr('likelihood3/text', state.elementEditor.originalLikelihood3);
            newState.elementEditor.data.element.attr('years/text', state.elementEditor.originalYears);
        }
        }
            if (!state.elementEditor.data.isLink) state.elementEditor.data.element.position(state.elementEditor.originalPosition.x, state.elementEditor.originalPosition.y);
            return Object.assign({}, state, { elementEditor: { visible: false } });

        case ActionTypes.EDITOR.ELEMENT_SAVE:
            return Object.assign({}, state, { elementEditor: { visible: false } });

        case ActionTypes.EDITOR.ELEMENT_DELETE:
            state.elementEditor.data.element.remove();
            return Object.assign({}, state, { elementEditor: { visible: false } });

        case ActionTypes.EDITOR.ELEMENT_RESET:
            if(newState.isProb){
                if(newState.elementEditor.data.element.isLink()){
                    newState.elementEditor.data.element.attr("likelihood/text", "");
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:""}}}]);
                }else{
                    newState.elementEditor.data.element.attr("likelihood/text", "");
                    newState.elementEditor.data.element.attr('body/stroke', "#000");
                }
            }else{
                if(newState.elementEditor.data.element.isLink()){
                    newState.elementEditor.data.element.attr("likelihood2/text", "");
                    newState.elementEditor.data.element.attr('likelihood3/text', "");  
                    newState.elementEditor.data.element.attr('years/text', '');                                                                     
                    newState.elementEditor.data.element.labels([{attrs:{text:{text:""}}}]);
                }else{
                    newState.elementEditor.data.element.attr('likelihood2/text', "");
                    newState.elementEditor.data.element.attr('likelihood3/text', "");
                    newState.elementEditor.data.element.attr('frame2/text', '');             
                    newState.elementEditor.data.element.attr('years/text', '');                               
                    newState.elementEditor.data.element.attr('body/stroke', "#000");
                }
            }
            return newState;

        case ActionTypes.EDITOR.ELEMENT_LABEL_EDIT:
            if(newState.elementEditor.data.element.isLink()){ 
                //newState.elementEditor.data.element.labels([{attrs:{text:{text:action.payload.label+'\n'+newState.elementEditor.data.likelihood}}}]);//{attrs: {text: {text: newState.elementEditor.data.label}, likelihood:{text: action.payload.likelihood}}}]);
                newState.elementEditor.data.element.attr('0.text/text', action.payload.label);
                newState.elementEditor.data.label = action.payload.label;
                //console.log(newState.elementEditor.data.element.set('labels/text', 0));
                //console.log(newState.elementEditor.data.element.labels('0.label/text'));
            }else{
                newState.elementEditor.data.element.attr('text/text', action.payload.label);
                newState.elementEditor.data.label = action.payload.label;
            } 
            return newState;

        case ActionTypes.EDITOR.ELEMENT_LIKELIHOOD_EDIT:
            if(newState.elementEditor.data.element.isLink()){
                newState.elementEditor.data.element.labels([{attrs:{text:{text:action.payload.likelihood}}}]);
                newState.elementEditor.data.element.attr('likelihood/text', action.payload.likelihood);  
                newState.elementEditor.data.likelihood = action.payload.likelihood;                
                newState.elementEditor.data.element.attr('likelihood2/text', '');
                newState.elementEditor.data.element.attr('likelihood3/text', '');
                newState.elementEditor.data.element.attr('years/text', '');  
                newState.elementEditor.data.element.attr('frame2/text', '');               
                newState.elementEditor.data.likelihood2 = '';  
                newState.elementEditor.data.likelihood3 = '';                              
                newState.elementEditor.data.years = '';
            }else{
                newState.elementEditor.data.element.attr('likelihood/text', action.payload.likelihood);
                newState.elementEditor.data.likelihood = action.payload.likelihood;                
                newState.elementEditor.data.element.attr('likelihood2/text', '');
                newState.elementEditor.data.element.attr('likelihood3/text', '');                
                newState.elementEditor.data.element.attr('years/text', '');  
                newState.elementEditor.data.element.attr('frame2/text', ''); 
                newState.elementEditor.data.likelihood2 = '';                              
                newState.elementEditor.data.likelihood3 = '';                              
                newState.elementEditor.data.years = '';
            }
        return newState;

        case ActionTypes.EDITOR.ELEMENT_LIKELIHOOD2_EDIT:
            if(newState.elementEditor.data.element.isLink()){
                newState.elementEditor.data.element.labels([{attrs:{text:{text:"[ "+action.payload.likelihood2+' - '+newState.elementEditor.data.element.attr('likelihood3/text')+" : " +newState.elementEditor.data.element.attr('years/text')+" y ]"}}}]);
                newState.elementEditor.data.element.attr('likelihood2/text', action.payload.likelihood2);  
                newState.elementEditor.data.likelihood2 = action.payload.likelihood2;
                newState.elementEditor.data.element.attr('likelihood/text', '');                             
                newState.elementEditor.data.likelihood = '';    
            }else{
                newState.elementEditor.data.element.attr('likelihood2/text', action.payload.likelihood2);
                newState.elementEditor.data.likelihood2 = action.payload.likelihood2;
                newState.elementEditor.data.element.attr('frame2/text', '[         -         :        y]'); 
                newState.elementEditor.data.element.attr('likelihood/text', '');
                newState.elementEditor.data.likelihood = '';
            }
        return newState;

        case ActionTypes.EDITOR.ELEMENT_LIKELIHOOD3_EDIT:
            if(newState.elementEditor.data.element.isLink()){
                newState.elementEditor.data.element.labels([{attrs:{text:{text:"[ "+newState.elementEditor.data.element.attr('likelihood2/text')+' - '+action.payload.likelihood3+" : " +newState.elementEditor.data.element.attr('years/text')+" y ]"}}}]);
                newState.elementEditor.data.element.attr('likelihood3/text', action.payload.likelihood3);  
                newState.elementEditor.data.likelihood3 = action.payload.likelihood3;
                newState.elementEditor.data.element.attr('likelihood/text', '');                             
                newState.elementEditor.data.likelihood = '';    
            }else{
                newState.elementEditor.data.element.attr('likelihood3/text', action.payload.likelihood3);
                newState.elementEditor.data.likelihood3 = action.payload.likelihood3;
                newState.elementEditor.data.element.attr('frame2/text', '[         -         :        y]'); 
                newState.elementEditor.data.element.attr('likelihood/text', '');
                newState.elementEditor.data.likelihood = '';
            }
        return newState;

        case ActionTypes.EDITOR.ELEMENT_YEARS_EDIT:
            if(newState.elementEditor.data.element.isLink()){
                console.log(newState.elementEditor.data.element);
                newState.elementEditor.data.element.labels([{attrs:{text:{text:"[ "+newState.elementEditor.data.element.attr('likelihood2/text')+" - "+newState.elementEditor.data.element.attr('likelihood3/text')+" : " +action.payload.years+" y ]"}}}]);
                newState.elementEditor.data.element.attr('years/text', action.payload.years);  
                newState.elementEditor.data.years = action.payload.years;
                newState.elementEditor.data.element.attr('likelihood/text', '');                             
                newState.elementEditor.data.likelihood = ''; 
            }else{
                newState.elementEditor.data.element.attr('years/text', action.payload.years);
                newState.elementEditor.data.element.attr('likelihood/text', '');            
                newState.elementEditor.data.years = action.payload.years;
                newState.elementEditor.data.element.attr('frame2/text', '[         -         :        y]');                 
                newState.elementEditor.data.likelihood = '';  
            }
        return newState;

        case ActionTypes.EDITOR.ELEMENT_CALCULATION_EDIT:
            //newState.elementEditor.data.element.set('isProb', action.payload.isProb);
            newState.isProb = action.payload.isProb;
            console.log(action.payload.isProb);
        return newState;

        case ActionTypes.EDITOR.ELEMENT_CHANGE_X:
            newState.elementEditor.data.position.x = parseInt(action.payload.x);
            newState.elementEditor.data.element.position(parseInt(action.payload.x), state.elementEditor.data.position.y);
            return newState;

        case ActionTypes.EDITOR.ELEMENT_CHANGE_Y:
            newState.elementEditor.data.position.y = parseInt(action.payload.y);
            newState.elementEditor.data.element.position(state.elementEditor.data.position.x, parseInt(action.payload.y));
            return newState;

        case ActionTypes.EDITOR.ELEMENT_CHANGE_TYPE:
            if(newState.elementEditor.data.element.isLink()) {
                newState.elementEditor.data.type = action.payload.type;

                if(action.payload.type === 0)
                    newState.elementEditor.data.element.attr({ '.connection': { stroke: '#000000', 'stroke-width': 2, 'stroke-dasharray': '' }});
                else if(action.payload.type === 1 || action.payload.type === 2)
                    newState.elementEditor.data.element.attr({ '.connection': { stroke: '#000000', 'stroke-width': 2, 'stroke-dasharray': "5 2" } })
                newState.elementEditor.data.element.set('corasType', action.payload.type);
            } else {
                const styles = newState.elementEditor.data.element.get('typeStyles');
                Object.keys(styles[action.payload.type]).map((item) => newState.elementEditor.data.element.attr(item, styles[action.payload.type][item]));
                newState.elementEditor.data.type = action.payload.type;
                newState.elementEditor.data.element.set('corasType', action.payload.type);
            }
            return newState;
            
        case ActionTypes.EDITOR.ELEMENT_CHANGE_RELATION:
            newState.elementEditor.data.relation = action.payload.i;
            console.log(action.payload.i);
            newState.elementEditor.data.element.set('relation', action.payload.i);
            return newState;

        case ActionTypes.EDITOR.TOOL_ELEMENT_CLICKED:
            newState.movement = action.payload;
            return newState;

        case ActionTypes.EDITOR.TOOL_ELEMENT_RELEASED:
            if (!newState.movement.element) return newState;
            const elem = newState.movement.element;
            newState.movement.element = null;
            elem.position(action.payload.pageX, action.payload.pageY);
            elem.resize(newState.movement.width, newState.movement.height);
            action.payload.graph.addCell(elem);
            return newState;
        
        case ActionTypes.EDITOR.TOOL_TAB_SELECTED:
            newState.editorToolSection = action.payload.tabNo;
            return newState;

        case ActionTypes.EDITOR.MENU_CLEAR_CLICKED:
            newState.editorMenu.showClearModal = !state.editorMenu.showClearModal;
            newState.editorMenu.clearPosition = { top: `${action.payload.event.pageY}px`, left: `${action.payload.event.pageX}px`}
            return newState;

        case ActionTypes.EDITOR.MENU_CLEAR_CONFIRMED:
            newState.editorMenu.showClearModal = !state.editorMenu.showClearModal;
            return newState;

        case ActionTypes.EDITOR.CELL_CLICKED:
            const { x, y, width, height } = action.payload;
            newState.cellTool = {
                open: true,
                position: {
                    x,
                    y
                },
                size: {
                    width,
                    height
                }
            };
            return newState;
        
        case ActionTypes.EDITOR.CELL_HANDLE_CLICKED:
            newState.cellTool.handleHeld = true;
            newState.cellTool.handle = action.payload.handle;
            return newState;
        
        case ActionTypes.EDITOR.CELL_HANDLE_RELEASED:
            newState.cellTool.handleHeld = false;
            newState.cellTool.handle = "";
            return newState;
        
        case ActionTypes.EDITOR.CELL_HANDLE_MOVED:
            if(state.cellTool.handleHeld) newState.cellTool.size = action.payload;
            return newState;
    }
}

const Store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default Store;
