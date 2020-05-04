import React from 'react';

import './elementeditor.css';
import{
    vulnerabilitySymbol,
    treatmentSymbol,
    assetSymbol
} from './svg//CorasSymbolsBase64.js';

class ElementEditor extends React.Component {
    constructor(props) {
        super(props);

        this.onLabelChange = this.onLabelChange.bind(this);
        this.onLikelihoodChange = this.onLikelihoodChange.bind(this);
        this.onLikelihoodChange2 = this.onLikelihoodChange2.bind(this);                        
        this.onLikelihoodChange3 = this.onLikelihoodChange3.bind(this);                        
        this.onPositionChangeX = this.onPositionChangeX.bind(this);
        this.onPositionChangeY = this.onPositionChangeY.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onRelationChange = this.onRelationChange.bind(this);
        //this.onIndependentChange = this.onIndependentChange.bind(this);
        //this.onCalculationChange = this.onCalculationChange.bind(this);
        this.onYearsChange = this.onYearsChange.bind(this);
        this.reset = this.reset.bind(this);
        

        const { x, y } = this.props.isLink ? { x: null, y: null } : this.props.element.position();

        this.state = {
            label: this.props.element.attr('text/text'),
            likelihood: this.props.element.attr('likelihood/text'),
            likelihood2: this.props.element.attr('likelihood2/text'),            
            likelihood3: this.props.element.attr('likelihood3/text'),            
            years:this.props.element.attr('years/text'),
            x,
            y,
            type: this.props.element.get('corasType'),
            relation: this.props.element.get('relation'),
            //independent: this.props.element.get('independent'),
            isProb: this.props.prob,
        }
    }
    
    onPositionChangeX(e) {
        this.props.xOnChange(e.target.value);
        this.setState({ x: e.target.value });
    }
    
    onPositionChangeY(e) {
        this.props.yOnChange(e.target.value);
        this.setState({ y: e.target.value });
    }

    onLabelChange(e) {
        this.props.labelOnChange(e.target.value);
        this.setState({ label: e.target.value });
    }

    onLikelihoodChange(e){
        if(e.target.value > 1){
            e.target.value = 1;
        }else if (e.target.value < 0){
            e.target.value = 0
        }
        this.props.likelihoodOnChange(e.target.value);
        this.setState({ likelihood: e.target.value });    
    }

    onLikelihoodChange2(e){
        this.props.likelihoodOnChange2(e.target.value);
        this.setState({ likelihood2: e.target.value });    
    }

    onLikelihoodChange3(e){
        this.props.likelihoodOnChange3(e.target.value);
        this.setState({ likelihood3: e.target.value });    
    }

    onYearsChange(e){
        this.props.yearsOnChange(e.target.value);
        this.setState({ years: e.target.value });
    }

    onTypeChange(e) {
        this.props.typeOnChange(parseInt(e.target.value));
        this.setState({ type: parseInt(e.target.value) });
        //console.log(this.state.type)
             
    }

    onRelationChange(e) {
        this.props.relationOnChange(parseInt(e.target.value));
        this.setState({ relation: parseInt(e.target.value) });
        //console.log(this.state.relation)
    }

    /*onIndependentChange(e){
        this.props.independentOnChange(!this.state.independent);
        this.setState({ independent: !this.state.independent }); 
    }*/

    reset(){
        this.props.reset();
        this.setState({ 
            likelihood: "",
            likelihood2: "",            
            likelihood3: "",            
            years: "",
        });
    }
    
    render() {
        return (
            <form className="element-editor" style={{ left: this.props.editorPosition.left, top: this.props.editorPosition.top }}>
                {!this.props.isLink ?  
                //Icons Editing Interface

                    //Independent checkbox & Label part
                    [<div className="element-editor-section">
                        <label htmlFor="label" className="element-editor-section__label element-editor-section__label--full">Label</label>
                        <textarea
                        id="label"
                        className="element-editor-section__input element-editor-section__input--100"
                        type="text"
                        value={this.state.label} 
                        onChange={this.onLabelChange}></textarea>
                    </div>,

                    //Likelihood part
                    <div className="element-editor-section">
                        {this.props.prob ? 
                            [<>
                            {this.props.source.get("type") === "coras.unboxedElement" || this.props.source.attr("icon/href") === treatmentSymbol ? null:[ 
                                <label htmlFor="likelihood" className="element-editor-section__label element-editor-section__label--full" >Likelihood</label>,
                                <input id="likelihood" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.likelihood} onChange={this.onLikelihoodChange}/>                                                        
                            ]}
                            </>]
                            :[<>
                            {this.props.source.get("type") === "coras.unboxedElement" || this.props.source.attr("icon/href") === treatmentSymbol ? null: [ 
                                <label htmlFor="likelihood" className="element-editor-section__label element-editor-section__label--full" >Likelihood</label>,
                                <input id="likelihood2" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.likelihood2} onChange={this.onLikelihoodChange2} style={{width:'15%'}}/>,
                                <label htmlFor="frequncey" className="element-editor-section__label">-</label>,
                                <input id="likelihood3" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.likelihood3} onChange={this.onLikelihoodChange3} style={{width:'15%'}}/>,                                
                                <label htmlFor="frequncey" className="element-editor-section__label">:</label>,      
                                <input id="years" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.years} onChange={this.onYearsChange} style={{width:'30%'}}/>,
                                <label htmlFor="years" className="element-editor-section__label">years</label>
                            ]}
                            </>]
                        }
                    </div>,

                    //Posistion part
                    <div className="element-editor-section">
                        <label className="element-editor-section__label element-editor-section__label--full">Position</label>
                        <div className="element-editor-section__partitioner">
                            <input id="x" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.x} onChange={this.onPositionChangeX} />
                            <label htmlFor="x" className="element-editor-section__label">x</label>
                        </div>
                        <div className="element-editor-section__partitioner">
                            <input id="y" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.y} onChange={this.onPositionChangeY} />
                            <label htmlFor="y" className="element-editor-section__label">y</label>
                        </div>
                    </div>] 
                : 

                //Links Editing Interface  

                    //Links can enter likelihood values, if the symbols' source is NOT Vulnerability
                    [this.props.source.attr("icon/href") !== vulnerabilitySymbol ? 

                        //Links can enter both probability and frequency of likelihood, if the symbols' source is "unboxedELement".
                        [!this.props.prob && this.props.source.get("type") === "coras.unboxedElement" ?
                            [
                            <div className="element-editor-section">
                                <label htmlFor="likelihood" className="element-editor-section__label element-editor-section__label--full" >Likelihood</label>                                                
                                <input id="likelihood2" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.likelihood2} onChange={this.onLikelihoodChange2} style={{width:'15%'}}/>
                                <label htmlFor="frequncey" className="element-editor-section__label">-</label>                                
                                <input id="likelihood3" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.likelihood3} onChange={this.onLikelihoodChange3} style={{width:'15%'}}/>                                
                                <label htmlFor="frequncey" className="element-editor-section__label">:</label>      
                                <input id="years" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.years} onChange={this.onYearsChange} style={{width:'30%'}}/>
                                <label htmlFor="years" className="element-editor-section__label">years</label>
                            </div>
                            ]:

                        //Links can only enter both probability of likelihood, if the symbols' source is NOT "unboxedELement".
                            [this.props.target.attr("icon/href") !== assetSymbol ?
                                <div className="element-editor-section">
                                    <label htmlFor="likelihood" className="element-editor-section__label element-editor-section__label--full" >Likelihood</label>                    
                                    <input id="likelihood" className="element-editor-section__input element-editor-section__input--75" type="number" value={this.state.likelihood} onChange={this.onLikelihoodChange}/>                                                
                                </div>
                                :
                                <div className="element-editor-section">
                                    <label htmlFor="likelihood" className="element-editor-section__label element-editor-section__label--full" >Likelihood</label>                    
                                    <input id="likelihood" className="element-editor-section__input element-editor-section__input--75" type="text" value={this.state.likelihood} onChange={this.onLikelihoodChange}/>                                                
                                </div>
                            ]
                        
                        ]:

                        //Links have not any editing interface, if the symbols' source is Vulnerability
                        []
                    ]
                }

               {//ELement type part
               <div className="element-editor-section">
                    <label className="element-editor-section__label element-editor-section__label--full">Element Type</label>
                    <RadioGroup name="symboltype" values={[ "Regular", "Before", "After" ]} currentValue={this.state.type} onChange={this.onTypeChange} />
               </div>}

                {//Element relation part
                    !this.props.isLink && this.props.source.attr("icon/href") !== vulnerabilitySymbol ?
                        <div className="element-editor-section">
                            <label className="element-editor-section__label element-editor-section__label--full">Element Relation</label>
                            <RadioGroup name="symbolrelation" values={[ "Mutually exclusive", "Statistically independent", "None" ]} currentValue={this.state.relation} onChange={this.onRelationChange} />
                        </div>
                    :
                    null
                }

                {//Button part
                <div className="element-editor-section">
                    <button className="element-editor-section__button element-editor-section__button--cta" type="button" onClick={this.props.save}>Save</button>
                    <button className="element-editor-section__button element-editor-section__button--re" type="button" onClick={this.reset}>Likelihood Reset</button>
                    <button className="element-editor-section__button" type="button" onClick={this.props.cancel}>Cancel</button>
                    <button className="element-editor-section__button element-editor-section__button--danger" type="button" onClick={this.props.delete}>Delete</button>
                </div>}
            </form>
        );
    }
}

const RadioButton = ({ name, value, checked, onChange, label }) =>
    <span>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange} />
        <label className="element-editor-section__label">{label}</label>
    </span>;

const RadioGroup = ({ name, values, currentValue, onChange }) =>
    <span>
        {values.map((value, index) => <RadioButton
                                        name={name}
                                        value={index}
                                        key={index}
                                        checked={index === currentValue}
                                        onChange={onChange}
                                        label={value} />)}
    </span>;
    


export default ElementEditor;