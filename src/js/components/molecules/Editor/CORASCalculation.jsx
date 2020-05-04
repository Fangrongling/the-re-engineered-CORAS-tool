import React from 'react';
import joint from 'jointjs';
import{
    vulnerabilitySymbol, assetSymbol,
} from './svg//CorasSymbolsBase64.js';

class CORASCalculation extends React.Component {
    constructor(props) {
        super(props);
        
        this.likelihoodCalculation = this.likelihoodCalculation.bind(this);
        /*this.calculationP = this.calculationP.bind(this);
        this.calculationF = this.calculationF.bind(this);
        this.cSimpleP = this.cSimpleP.bind(this);
        this.cMultipleP = this.cMultipleP.bind(this);
        this.cSimpleP = this.cSimpleP.bind(this);
        this.cMultipleP = this.cMultipleP.bind(this);*/
    }

      //Initiate likelihood calculation
    likelihoodCalculation(){
        var targets = this.props.graph.getSinks(); 
        var consistentRelation = true;
        if(this.props.isProb){
            if (targets.length > 1){
                targets.map((target) =>{
                    this.calculationP(target, consistentRelation);
                })
            }else{
                this.calculationP(targets[0], consistentRelation);
            }
        }else{
            if (targets.length > 1){
                targets.map((target) =>{
                    this.calculationF(target, consistentRelation);
                })
            }else{
                this.calculationF(targets[0], consistentRelation);
            }
        }
    }

    //recursive algorithm of Probability calculation
    calculationP(target, consistentRelation){
        var links = this.props.graph.getConnectedLinks(target, { inbound: true });
        
        //One inbound link situation
        if(links.length === 1){
            
            var linkSource = this.props.graph.getCell(links[0].get('source').id);
            consistentRelation = this.calculationP(linkSource, consistentRelation);
            
            //Not calculating for asset
            if(target.attr("icon/href") !== assetSymbol){
                //Jump over(ignore) vulnerability
                if(linkSource.attr("icon/href") === vulnerabilitySymbol){       
                    links = this.props.graph.getConnectedLinks(linkSource, { inbound: true });
                    if(links.length === 1){
                        linkSource = this.props.graph.getCell(links[0].get('source').id);
                        this.cSimpleP(target, links, linkSource);
                    }else{
                        var relation = this.props.graph.getCell(links[links.length-1].get('source').id).get('relation');
                        links.map((link) => {
                            var linkSource = this.props.graph.getCell(link.get('source').id); 
                            if(linkSource.get('relation') === relation){
                                if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                    linkSource.attr('body/fill', "#fff"); 
                                    this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                                consistentRelation = false;
                                alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                + '\n Because it is inconsistent with other related.');
                                linkSource.attr('body/fill', "#F44336");
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                            }
                        });
                        if(consistentRelation){
                            var source = this.props.graph.getNeighbors(linkSource, { inbound: true });
                            this.cMultipleP(target, links, source, relation);
                        }
                    }
                    //return consistentRelation;
                }else if(target.attr("icon/href") === vulnerabilitySymbol){
                    //return consistentRelation;
                }else{
                    if(consistentRelation){
                        this.cSimpleP(target, links, linkSource);
                    }
                    //return consistentRelation;                    
                }
            }
            return consistentRelation;
        //Multiple inbound links situation  
        }else if(links.length > 1){
            var relation = this.props.graph.getCell(links[links.length-1].get('source').id).get('relation');
            var source = [];
            var vulLinks = [];
            
            if(target.attr("icon/href") === vulnerabilitySymbol){
                
            }else{
                links.map((link) => {
                    var linkSource = this.props.graph.getCell(link.get('source').id);  
                    consistentRelation = this.calculationP(linkSource, consistentRelation);   
                    //Jump over(ignore) vulnerability and save all source elements of the element in array
                    if(linkSource.attr("icon/href") === vulnerabilitySymbol){ 
                        var newlinks = this.props.graph.getConnectedLinks(linkSource, { inbound: true });
                        if(newlinks.length === 1){
                            linkSource = this.props.graph.getCell(newlinks[0].get('source').id);
                            source=[...source,linkSource];
                            vulLinks=[...vulLinks,newlinks[0]];
                            if(linkSource.get('relation') === relation){
                                if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                    linkSource.attr('body/fill', "#fff"); 
                                    this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                            }else{
                                consistentRelation = false;
                                alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                + '\n Because it is inconsistent with other related.');
                                linkSource.attr('body/fill', "#F44336");
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                            }
                        }else{
                            newlinks.map((newlink) => {
                                linkSource = this.props.graph.getCell(newlink.get('source').id); 
                                source=[...source,linkSource];
                                vulLinks=[...vulLinks,newlink];
                                if(linkSource.get('relation') === relation){
                                    if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                        linkSource.attr('body/fill', "#fff"); 
                                        this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                                }else{
                                    consistentRelation = false;
                                    alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                    + '\n Because it is inconsistent with other related.');
                                    linkSource.attr('body/fill', "#F44336");
                                    this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                                }
                            });
                        }
                    //Save all source elements of the element in array
                    }else{
                        source=[...source,linkSource];
                        vulLinks=[...vulLinks,link];
                        if(linkSource.get('relation') === relation){
                            if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                linkSource.attr('body/fill', "#fff"); 
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                        }else{
                            consistentRelation = false;
                            alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                            + '\n Because it is inconsistent with other related.');
                            linkSource.attr('body/fill', "#F44336");
                            this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                        }
                        
                    }
                });
                //Not calculating for asset
                if(target.attr("icon/href") !== assetSymbol && consistentRelation){
                    this.cMultipleP(target, vulLinks, source, relation);
                }       
            }
        }else{//do nothing if there are not any link.
        }
        return consistentRelation;
    }

    //recursive algorithm of Frequency calculation
    calculationF(target, consistentRelation){
        var links = this.props.graph.getConnectedLinks(target, { inbound: true });
        
        //One inbound link situation
        if(links.length === 1){
            var linkSource = this.props.graph.getCell(links[0].get('source').id);
            consistentRelation = this.calculationF(linkSource, consistentRelation);
            
            //Not calculating for asset
            if(target.attr("icon/href") !== assetSymbol){

                 //Jump over(ignore) vulnerability and save all source elements of the element in array
                if(linkSource.attr("icon/href") === vulnerabilitySymbol){       
                    links = this.props.graph.getConnectedLinks(linkSource, { inbound: true });
                    if(links.length === 1){
                        linkSource = this.props.graph.getCell(links[0].get('source').id);
                        this.cSimpleF(target, links, linkSource);
                    }else{
                        var relation = this.props.graph.getCell(links[links.length-1].get('source').id).get('relation');
                        links.map((link) => {
                            var linkSource = this.props.graph.getCell(link.get('source').id); 
                            if(linkSource.get('relation') === relation){console.log(1)
                                if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                    linkSource.attr('body/fill', "#fff"); 
                                    this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                            }else{console.log(1)
                                consistentRelation = false;
                                alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                + '\n Because it is inconsistent with other related.');
                                linkSource.attr('body/fill', "#F44336");
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                            }
                        });

                        if(consistentRelation){
                            var source = this.props.graph.getNeighbors(linkSource, { inbound: true });
                            this.cMultipleF(target, links, source, relation);
                        }
                        
                    }
                }else if(target.attr("icon/href") === vulnerabilitySymbol){

                }else{
                    if(consistentRelation){
                        this.cSimpleF(target, links, linkSource);
                    }
                }

            }
            return consistentRelation;

        //Multiple inbound links situation  
        }else if(links.length > 1){
            var relation = this.props.graph.getCell(links[links.length-1].get('source').id).get('relation');
            var source = [];
            var vulLinks = [];
            this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
            
            if(target.attr("icon/href") === vulnerabilitySymbol){

            }else{
                links.map((link) => {
                    var linkSource = this.props.graph.getCell(link.get('source').id); 
                    consistentRelation = this.calculationF(linkSource, consistentRelation);   
                    if(linkSource.attr("icon/href") === vulnerabilitySymbol){ 
                        var newlinks = this.props.graph.getConnectedLinks(linkSource, { inbound: true });
                        if(newlinks.length === 1){
                            linkSource = this.props.graph.getCell(newlinks[0].get('source').id);
                            source=[...source,linkSource];
                            vulLinks=[...vulLinks,newlinks[0]];console.log(1)
                            if(linkSource.get('relation') === relation){
                                if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                linkSource.attr('body/fill', "#fff"); 
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                            }else{
                                consistentRelation = false;
                                alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                + '\n Because it is inconsistent with other related.');
                                linkSource.attr('body/fill', "#F44336");
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                            }
                        }else{console.log(2)
                            newlinks.map((newlink) => {
                                linkSource = this.props.graph.getCell(newlink.get('source').id); 
                                source=[...source,linkSource];
                                vulLinks=[...vulLinks,newlink];
                                if(linkSource.get('relation') === relation){
                                    if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                        linkSource.attr('body/fill', "#fff"); 
                                        this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}
                                }else{
                                    consistentRelation = false;
                                    alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                    + '\n Because it is inconsistent with other related.');
                                    linkSource.attr('body/fill', "#F44336");
                                    this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                                }
                            });
                        }
                    }else{console.log(3)
                        source=[...source,linkSource];
                        vulLinks=[...vulLinks,link];
                        if(linkSource.get('relation') === relation) {
                            if(linkSource !== this.props.graph.getCell(links[links.length-1].get('source').id)){
                                linkSource.attr('body/fill', "#fff"); 
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#fff");}                            
                            }else{console.log(3.2)
                                consistentRelation = false;
                                alert("Erro: Please Check the ELement relation of " + linkSource.attr('text/text') 
                                + '\n Because it is inconsistent with other related.');
                                linkSource.attr('body/fill', "#F44336");
                                this.props.graph.getCell(links[links.length-1].get('source').id).attr('body/fill', "#F44336");
                            }
                    }
                });
                //Not calculating for asset
                if(target.attr("icon/href") !== assetSymbol && consistentRelation){
                    this.cMultipleF(target, vulLinks, source, relation);      
                }
            }
        }else{//do nothing if there are not any link.
        }
        return consistentRelation;
    }

    cSimpleP(target, links, linkSource){
        //Rule 13.1: Initiates
        if((target.attr('likelihood/text') === '' || target.attr('likelihood/text') === null) && linkSource.attr('likelihood/text') === "" ){
            target.attr('likelihood/text', Number(links[0].attr('likelihood/text')).toFixed(2));
            links[0].attr('likelihood2/text', ""); 
            target.attr('likelihood2/text', ""); 
            target.attr('likelihood3/text', ""); 
            target.attr('frame2/text', '');                  
            target.attr('years/text', '');                                 
            target.attr('body/stroke', "#000");  
            linkSource.attr('likelihood2/text', "");
            linkSource.attr('frame2/text', '');
            linkSource.attr('years/text', '');                                         
            //console.log(target.attr('likelihood/text'));   
            
        //Rule 13.2: Leads-to
        }else if((target.attr('likelihood/text') === '' || target.attr('likelihood/text') === null) && linkSource.attr('likelihood/text') !== ""){
            target.attr('likelihood/text', Number(linkSource.attr('likelihood/text')*links[0].attr('likelihood/text')).toFixed(2));  
            links[0].attr('likelihood2/text', "");             
            target.attr('likelihood2/text', ""); 
            target.attr('likelihood3/text', "");  
            target.attr('frame2/text', '');                  
            target.attr('years/text', '');                                     
            target.attr('body/stroke', "#000");                               

        //Check the input likelihood vaule whether are consistent with the calculated values                
        }else{
            //Check initiates
            if(linkSource.attr('likelihood/text') === ''){
                if(Number(target.attr('likelihood/text')).toFixed(2) === Number(links[0].attr('likelihood/text')).toFixed(2)){
                    links[0].attr('likelihood2/text', ""); 
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#000");  
                    linkSource.attr('likelihood2/text', "");
                    linkSource.attr('likelihood3/text', "");
                    linkSource.attr('frame2/text', '');
                    linkSource.attr('years/text', '');                             
                }else{
                    links[0].attr('likelihood2/text', "");
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#F44336");
                    alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood/text')+ "\n" 
                            +"the caculated value is " + links[0].attr('likelihood/text')
                            + "\nPlease manually modify!");
                    console.log(linkSource, links[0])
                }
            //Check leads-to
            }else{
                if(Number(target.attr('likelihood/text')).toFixed(2) === (linkSource.attr('likelihood/text')*links[0].attr('likelihood/text')).toFixed(2)){
                    links[0].attr('likelihood2/text', "");
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#000");  
                    linkSource.attr('likelihood2/text', "");
                    linkSource.attr('likelihood3/text', "");
                    linkSource.attr('frame2/text', '');
                    linkSource.attr('years/text', '');                              
                }else{
                    links[0].attr('likelihood2/text', "");
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#F44336"); 
                    linkSource.attr('likelihood2/text', "");
                    linkSource.attr('likelihood3/text', "");
                    linkSource.attr('frame2/text', '');
                    linkSource.attr('years/text', '');                        
                    alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood/text')+ "\n" 
                            +"the caculated value is " + (linkSource.attr('likelihood/text')*links[0].attr('likelihood/text')).toFixed(2)
                            + "\nPlease manually modify!");
                }
            }
        }   
    }

    cMultipleP(target, links, source, relation){
        var sum = 0, mul = 1;
        var max = 0, min = 0;
        
        //consistency calculate of mautually exclusive incidents and independent incidents
        if(relation === 0){//Mautually exclusive incidents
            
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood/text') === "" || target.attr('likelihood/text') === null){
                
                //Rule 13.3: Mautually exclusive secario/incidents
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood/text') === ""){
                        sum += Number(links[i].attr('likelihood/text'));
                        /*source[i].attr('likelihood2/text', "");
                        source[i].attr('likelihood3/text', "");
                        source[i].attr('frame2/text', '');
                        source[i].attr('years/text', '');  
                        links[i].attr('likelihood2/text', '');*/
                    }else{
                        sum += (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                target.attr('likelihood/text', (sum).toFixed(2));
                target.attr('likelihood2/text', "");                  
                target.attr('likelihood3/text', "");                  
                target.attr('frame2/text', '');                  
                target.attr('years/text', '');                  
                //target.attr('body/stroke', "#000");                               

            //Check the input likelihood vaule whether are consistent with the calculated values     
            }else{
               
                //Rule 13.3: Mautually exclusive secario/incidents
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood/text') === ""){
                        sum += Number(links[i].attr('likelihood/text'));
                        source[i].attr('likelihood2/text', "");
                        source[i].attr('likelihood3/text', "");
                        source[i].attr('frame2/text', '');
                        source[i].attr('years/text', ''); 
                        links[i].attr('likelihood2/text', '');
                    }else{
                        sum += (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                var result = sum;
                if(Number(target.attr('likelihood/text')).toFixed(2) === result.toFixed(2)){
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#000");    
                    console.log("233333")
                }else{
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#F44336");

                    alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood/text')+ " and\n" 
                            +"the caculated value is " + result.toFixed(2)
                            + "\nPlease manually modify!");
                }
            }

        }else if(relation === 1){//Independent incidents
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood/text') === "" || target.attr('likelihood/text') === null){
                //Rule 13.4: Independent secario/incidents
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood/text') === ""){
                        sum += Number(links[i].attr('likelihood/text'));
                        mul *=  Number(links[i].attr('likelihood/text'));
                        source[i].attr('likelihood2/text', "");
                        source[i].attr('likelihood3/text', "");
                        source[i].attr('frame2/text', '');
                        source[i].attr('years/text', ''); 
                        links[i].attr('likelihood2/text', '');
                    }else{
                        sum += (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                        mul *=  (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                target.attr('likelihood/text', (sum-mul).toFixed(2));
                target.attr('likelihood2/text', ""); 
                target.attr('likelihood3/text', "");                 
                target.attr('frame2/text', '');                  
                target.attr('years/text', '');                  
                //target.attr('body/stroke', "#000");                               

            //Check the input likelihood vaule whether are consistent with the calculated values     
            }else{
                
                //Rule 13.4: Independent secario/incidents
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood/text') === ""){
                        sum += Number(links[i].attr('likelihood/text'));
                        mul *=  Number(links[i].attr('likelihood/text'));
                        source[i].attr('likelihood2/text', "");
                        source[i].attr('likelihood3/text', "");
                        source[i].attr('frame2/text', '');
                        source[i].attr('years/text', ''); 
                        links[i].attr('likelihood2/text', '');
                    }else{
                        sum += (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                        mul *=  (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                var result = sum-mul;
                
                if(Number(target.attr('likelihood/text')).toFixed(2) === result.toFixed(2)){
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#000");  
                    console.log("1234567")                                                                 
                }else{
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#F44336");
                    
                    alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood/text')+ " and\n" 
                            +"the caculated value is " + result.toFixed(2)
                            + "\nPlease manually modify!");
                }
            }
        }else{
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood/text') === "" || target.attr('likelihood/text') === null){
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood/text') === ""){
                        max += Number(links[i].attr('likelihood/text'));
                        if(min < Number(links[i].attr('likelihood/text'))){
                            min = Number(links[i].attr('likelihood/text'));
                        }
                        source[i].attr('likelihood2/text', "");
                        source[i].attr('likelihood3/text', "");
                        source[i].attr('frame2/text', '');
                        source[i].attr('years/text', ''); 
                        links[i].attr('likelihood2/text', '');
                    }else{
                        max += (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                        if(min < (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')))){
                            min = (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                        }
                    }
                }
                target.attr('likelihood/text', "["+min.toFixed(2)+", "+max.toFixed(2)+"]");
                console.log(min + " " +max);
                target.attr('likelihood2/text', "");  
                target.attr('likelihood3/text', "");                
                target.attr('frame2/text', '');                  
                target.attr('years/text', ''); 
            }else{
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood/text') === ""){
                        max += Number(links[i].attr('likelihood/text'));
                        if(min < Number(links[i].attr('likelihood/text'))){
                            min = Number(links[i].attr('likelihood/text'));
                        }
                        source[i].attr('likelihood2/text', "");
                        source[i].attr('likelihood3/text', "");
                        source[i].attr('frame2/text', '');
                        source[i].attr('years/text', ''); 
                        links[i].attr('likelihood2/text', '');
                    }else{
                        max += (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                        if(min < (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')))){
                            min = (source[i].attr('likelihood/text')* Number(links[i].attr('likelihood/text')));
                        }
                    }
                }
                var result="["+min.toFixed(2)+", "+max.toFixed(2)+"]"
                if(target.attr('likelihood/text') === result){
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#000");  
                }else{
                    target.attr('frame2/text', '');                  
                    target.attr('years/text', '');     
                    target.attr('body/stroke', "#F44336");
                    
                    alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood/text')+ " and\n" 
                            +"the caculated value is " + result
                            + "\nPlease manually modify!");
                }
            }
        }
    }

    cSimpleF(target, links, linkSource){
        var linkSource = this.props.graph.getCell(links[0].get('source').id);
        this.calculationF(linkSource);
        //console.log(1);

    //Likelihood 2
        //Rule 13.9: Initiates 
        if(((target.attr('likelihood2/text') === "" || target.attr('likelihood2/text') === null)) && linkSource.attr('likelihood2/text') === "" ){
            target.attr('likelihood2/text', links[0].attr('likelihood2/text')); 
            target.attr('years/text', links[0].attr('years/text')); 
            target.attr('frame2/text', '[         -         :        y]');  
            target.attr('likelihood/text', ""); 
            target.attr('body/stroke', "#000");     
            linkSource.attr('likelihood/text', "");                                          
            //console.log(target.attr('likelihood2/text'));   
            //console.log(1.1);
            //console.log(target.attr('likelihood2/text'));
        
        //Rule 13.10: Leads-to            
        }else if(((target.attr('likelihood2/text') === "" || target.attr('likelihood2/text') === null) )&& linkSource.attr('likelihood2/text') !== ""){
            //console.log(1.2);
            target.attr('likelihood2/text', linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text'));
            target.attr('years/text', linkSource.attr('years/text'));
            target.attr('frame2/text', '[         -         :        y]');  
            target.attr('likelihood/text', ""); 
            target.attr('body/stroke', "#000");                                                
            linkSource.attr('likelihood/text', "");      

        //Check the input likelihood vaule whether are consistent with the calculated values 
        }else{
            //Check initiates            
            if(linkSource.attr('likelihood2/text') === ""){ 
                if(Number(target.attr('likelihood2/text')) <= Number(links[0].attr('likelihood2/text'))&&
                Number(target.attr('likelihood3/text')) >= Number(links[0].attr('likelihood3/text'))){
                    //console.log(2.1);
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000");                              
                    linkSource.attr('likelihood/text', "");  
                    console.log(Number(target.attr('likelihood2/text')).toFixed(1), Number(links[0].attr('likelihood2/text')).toFixed(1));   
                    console.log(Number(target.attr('likelihood2/text')).toFixed(1) <= Number(links[0].attr('likelihood2/text')).toFixed(1));                                     
                }else{
                    //console.log(2.2);
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    /*alert("Erro: values consistency!!!\n"
                           + "Please anually modify" + target.attr('text/text') + "!");
                           // +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ "\n" 
                            //+"the caculated value is " + linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text')
                            //+ "\nPlease manually modify!");*/
                }

            //Check Leads-to
            }else{
                //console.log(2.3);
                if(Number(target.attr('likelihood2/text')) <= Number(linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text')) &&
                Number(target.attr('likelihood3/text')) >= Number(linkSource.attr('likelihood3/text')*links[0].attr('likelihood/text'))){
                    //console.log(2.4);
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000");                               

                }else{                        
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");                        
                    /*alert("Erro: values consistency!!!\n"
                        + "Please anually modify" + target.attr('text/text') + "!");
                            //+target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ "\n" 
                            //+"the caculated value is " + (linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text')).toFixed(1)
                            //+ "\nPlease manually modify!");*/
                }
            }
        }

    //Likelihood 3
        //Rule 13.9: Initiates
        if((target.attr('likelihood3/text') === "" || target.attr('likelihood3/text') === null) && linkSource.attr('likelihood3/text') === "" ){
            if(links[0].attr('likelihood3/text') !== ""){
                target.attr('likelihood3/text', links[0].attr('likelihood3/text')); 
            }
            target.attr('years/text', links[0].attr('years/text')); 
            target.attr('frame2/text', '[         -         :        y]');  
            target.attr('likelihood/text', ""); 
            //target.attr('body/stroke', "#000");     
            linkSource.attr('likelihood/text', ""); 
            //console.log(3);
      
        //Rule 13.10: Leads-to
        }else if(((target.attr('likelihood3/text') === "" || target.attr('likelihood3/text')=== null)) && linkSource.attr('likelihood3/text') !== ""){
            target.attr('likelihood3/text', linkSource.attr('likelihood3/text')*links[0].attr('likelihood/text'));                 
            target.attr('years/text', linkSource.attr('years/text'));
            target.attr('frame2/text', '[         -         :        y]');  
            target.attr('likelihood/text', ""); 
            //target.attr('body/stroke', "#000");                                                
            linkSource.attr('likelihood/text', ""); 
            //console.log(33);

        //Check the input likelihood vaule whether are consistent with the calculated values                
        }else{
            //Check initiates
            if(linkSource.attr('likelihood3/text') === "" ){console.log(3.4);
                if(Number(target.attr('likelihood2/text')) <= Number(links[0].attr('likelihood2/text'))&&
                Number(target.attr('likelihood3/text')) >= Number(links[0].attr('likelihood3/text'))){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000");                              
                    linkSource.attr('likelihood/text', "");   
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    /*alert("Erro: values consistency!!!\n"
                           + "Please anually modify" + target.attr('text/text') + "!");
                           // +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ "\n" 
                            //+"the caculated value is " + linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text')
                            //+ "\nPlease manually modify!");*/
                }

            //Check leads-to
            }else{
                if(Number(target.attr('likelihood2/text')) <= Number(linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text')) &&
                Number(target.attr('likelihood3/text')) >= Number(linkSource.attr('likelihood3/text')*links[0].attr('likelihood/text'))){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000"); 

                }else{                        
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");                        
                    /*alert("Erro: values consistency!!!\n"
                        + "Please anually modify" + target.attr('text/text') + "!");
                            //+target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ "\n" 
                            //+"the caculated value is " + (linkSource.attr('likelihood2/text')*links[0].attr('likelihood/text')).toFixed(1)
                            //+ "\nPlease manually modify!");*/
                }
            }
        }  
    }

    cMultipleF(target, links, source, relation){
        var sum2 = 0, sum3 = 0, f2 = "", f3 = "";
        var max = 0, min = 0;
        var value2 = false;

    //Linkelihood 2
        if(relation === 0){//Mautually exclusive incidents
            
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood2/text') === "" || target.attr('likelihood2/text') === null){
                //Rule 13.11: Muatually exclusive secario/incidents
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates 
                    if(source[i].attr('likelihood2/text') === ""){
                        
                        if(f2 === ""){
                            f2 = Number(links[i].attr('likelihood2/text'));
                        }else{
                            f2 = Math.max(Number(links[i].attr('likelihood2/text')),f2);
                        }
                    //Rule 13.10: Leads-to    
                    }else{
                        if(f2 === ""){
                            f2 = (source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text')));
                        }else{
                            f2 = Math.max((source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text'))),f2);
                        }
                    
                    }   
                }
                //console.log(target) 
                target.attr('likelihood2/text', Number(f2).toFixed(1)); 
                target.attr('likelihood/text', ""); 
                target.attr('frame2/text', '[         -         :        y]');  
                target.attr('years/text', source[0].attr('years/text'));                
                target.attr('body/stroke', "#000"); 

            //Check the input likelihood vaule whether are consistent with the calculated values  
            }else{
                //Rule 13.11: Muatually exclusive secario/incidents
                for(var i = 0; i<links.length ; i++){
                    //console.log(source[i].attr('likelihood2/text'),i)
                    //Rule 13.9: Initiates 
                    if(source[i].attr('likelihood2/text') === ""){
                        if(f2 === ""){
                            f2 = Number(links[i].attr('likelihood/text'));
                            //console.log(f)
                        }else{
                            f2 = Math.max(Number(links[i].attr('likelihood2/text')),f2);
                        }
                    //Rule 13.10: Leads-to
                    }else{
                        //console.log(f)
                        if(f2 === ""){
                            f2 = (source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text')));
                            //console.log(f)
                        }else{
                            f2 = Math.max((source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text'))),f2);
                        }
                    
                    }   
                }
                if(Number(target.attr('likelihood2/text')) <= Number(f2)){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000");   
                    value2 = true; 
                    //console.log("2yes")                                           
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    target.attr('body/stroke', "#F44336");
                    console.log(target.attr('body/stroke'))
                    /*alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ " and\n" 
                            +"the caculated value is " + Number(f2).toFixed(1)
                            + "\nPlease manually modify!");*/
                }
            }
        }else if (relation === 1){
        
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood2/text') === "" || target.attr('likelihood2/text') === null){
                //Rule 13.12: Independent secario/incidents
                //console.log(213.12);
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates
                    if(source[i].attr('likelihood2/text') === ""){
                        source[i].attr('likelihood/text', "");
                        sum2 += Number(links[i].attr('likelihood2/text'));
                    }else{
                    //Rule 13.10: Leads-to
                        sum2 += (source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                target.attr('likelihood2/text', (sum2).toFixed(1)); 
                target.attr('likelihood/text', ""); 
                target.attr('frame2/text', '[         -         :        y]');  
                target.attr('years/text', source[0].attr('years/text'));                
                //target.attr('body/stroke', "#000");                                               

            //Check the input likelihood vaule whether are consistent with the calculated values     
            }else{
                //Rule 13.12: Independent secario/incidents
                //console.log(313.12);
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates
                    if(source[i].attr('likelihood2/text') === "" || source[i].attr('likelihood2/text') === null){
                        source[i].attr('likelihood/text', "");
                        sum2 += Number(links[i].attr('likelihood2/text'));
                    }else{
                        //Rule 13.10: Leads-to
                        sum2 += (source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                var result = sum2;
                if(Number(target.attr('likelihood2/text')) <= result){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    value2 = true;
                    //target.attr('body/stroke', "#000");  
                    //console.log("22yes")                                             
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    //console.log("22no")
                    /*alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ " and\n" 
                            +"the caculated value is " + result.toFixed(1)
                            + "\nPlease manually modify!");*/
                }
            }
        }else{
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood2/text') === "" || target.attr('likelihood2/text') === null){
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood2/text') === ""){
                        source[i].attr('likelihood/text', "");
                        min = Math.max(min, Number(links[i].attr('likelihood/text')));
                    }else{
                        min =  Math.max(min, source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text')));
                    }
                    
                }
                target.attr('likelihood2/text', (min).toFixed(1)); 
                target.attr('likelihood/text', ""); 
                target.attr('frame2/text', '[         -         :        y]');  
                target.attr('years/text', source[0].attr('years/text'));
            }else{
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood2/text') === ""){
                        source[i].attr('likelihood/text', "");
                        min = Math.max(min, Number(links[i].attr('likelihood/text')));
                    }else{
                        min =  Math.max(min, source[i].attr('likelihood2/text')* Number(links[i].attr('likelihood/text')));
                    }
                    
                }
                var result = min;
                if(Number(target.attr('likelihood2/text')) <= result){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    value2 = true;
                    //target.attr('body/stroke', "#000");  
                    //console.log("22yes")                                             
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    //console.log("22no")
                    alert("Erro: values consistency!!!\n"
                            +target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ " and\n" 
                            +"the caculated value is " + result.toFixed(1)
                            + "\nPlease manually modify!");
                }
            }
        }
    
    //Linkelihood 3
        if(relation === 0){ 
            
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood3/text') === "" || target.attr('likelihood3/text') === null){
                //Rule 13.11: Muatually exclusive secario/incidents
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates 
                    if(source[i].attr('likelihood3/text') === ""){
                        source[i].attr('likelihood3/text', "");
                        if(f3 === ""){
                            f3 = Number(links[i].attr('likelihood3/text'));
                        }else{
                            f3 = Math.max(Number(links[i].attr('likelihood3/text')),f3);
                        }
                    //Rule 13.10: Leads-to    
                    }else{
                        if(f3 === ""){
                            f3 = (source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text')));
                        }else{
                            f3 = Math.max((source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text'))),f3);
                        }
                    
                    }   
                }
                target.attr('likelihood3/text', Number(f3).toFixed(1)); 
                target.attr('likelihood/text', ""); 
                target.attr('frame2/text', '[         -         :        y]');  
                target.attr('years/text', source[0].attr('years/text'));                
                //target.attr('body/stroke', "#000");  

            //Check the input likelihood vaule whether are consistent with the calculated values  
            }else{
                //Rule 13.11: Muatually exclusive secario/incidents
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates 
                    if(source[i].attr('likelihood3/text') === ""){
                        if(f3 === ""){
                            f3 = Number(links[i].attr('likelihood/text'));
                        }else{
                            f3 = Math.max(Number(links[i].attr('likelihood3/text')),f3); 
                        }
                    //Rule 13.10: Leads-to
                    }else{
                        if(f3 === ""){
                            f3 = (source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text')));
                        }else{
                            f3 = Math.max((source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text'))),f3);
                        }
                    
                    }   
                }
                if((Number(target.attr('likelihood3/text')) >= Number(f3)) && value2){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000"); 
                    console.log((Number(target.attr('likelihood3/text')).toFixed(1)) >= (Number(f3).toFixed(1)));
                    console.log(Number(target.attr('likelihood3/text')).toFixed(1), Number(f3).toFixed(1));                                             
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    alert("Erro: values consistency!!!\n"
                            //+target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ " and\n" 
                            //+"the caculated value is " + Number(f).toFixed(1)
                            + "Please manually modify the red area(s)!");
                }
            }
        }else if(relation === 1){
            
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood3/text') === "" || target.attr('likelihood3/text') === null){
                //Rule 13.12: Independent secario/incidents
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates
                    if(source[i].attr('likelihood3/text') === ""){
                        source[i].attr('likelihood/text', "");
                        sum3 += Number(links[i].attr('likelihood3/text'));
                    }else{
                    //Rule 13.10: Leads-to
                        sum3 += (source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                target.attr('likelihood3/text', (sum3).toFixed(1)); 
                target.attr('likelihood/text', ""); 
                target.attr('frame2/text', '[         -         :        y]');  
                target.attr('years/text', source[0].attr('years/text'));                
                //target.attr('body/stroke', "#000");                                               

            //Check the input likelihood vaule whether are consistent with the calculated values     
            }else{
                //Rule 13.12: Independent secario/incidents
                console.log(313.12);
                for(var i = 0; i<links.length ; i++){
                    //Rule 13.9: Initiates
                    if(source[i].attr('likelihood3/text') === ""){
                        source[i].attr('likelihood/text', "");
                        sum3 += Number(links[i].attr('likelihood3/text'));
                            
                    }else{
                    //Rule 13.10: Leads-to
                        sum3 += (source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text')));
                    }   
                }
                var result = sum3;
                if(Number(target.attr('likelihood3/text')) >= result && value2){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000"); 
                    console.log("3yes")                                              
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    //console.log(independent, Number(target.attr('likelihood3/text')).toFixed(1), result.toFixed(1))
                    //alert("Erro: values consistency!!!\n"
                            //+target.attr('text/text')+"'s likelihood is " + target.attr('likelihood2/text')+ " and\n" 
                            //+"the caculated value is " + result.toFixed(1)
                            //+ "\nPlease manually modify!");
                    alert("Erro: values consistency!!!\n"
                        + "Please manually modify the red area(s)!");
                }
            }

        }else{
            //Write down calcculated value if likelihood value is empty
            if(target.attr('likelihood3/text') === "" || target.attr('likelihood3/text') === null){
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood3/text') === ""){
                        source[i].attr('likelihood/text', "");
                        max += Number(links[i].attr('likelihood/text'));
                    }else{
                        max += source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text'));
                    }
                    
                }
                target.attr('likelihood3/text', (max).toFixed(1)); 
                target.attr('likelihood/text', ""); 
                target.attr('frame2/text', '[         -         :        y]');  
                target.attr('years/text', source[0].attr('years/text'));
            }else{
                for(var i = 0; i<links.length ; i++){
                    if(source[i].attr('likelihood3/text') === ""){
                        source[i].attr('likelihood/text', "");
                        max += Number(links[i].attr('likelihood/text'));
                    }else{
                        max += source[i].attr('likelihood3/text')* Number(links[i].attr('likelihood/text'));
                    }
                    
                }
                var result = max;
                if(Number(target.attr('likelihood3/text')) >= result && value2){
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#000");  
                    //console.log("22yes")                                             
                }else{
                    target.attr('frame2/text', '[         -         :        y]');  
                    target.attr('likelihood/text', ""); 
                    target.attr('body/stroke', "#F44336");
                    //console.log("22no")
                    alert("Erro: values consistency!!!\n"
                        //+target.attr('text/text')+"'s likelihood is " + target.attr('likelihood3/text')+ " and\n" 
                        //+"the caculated value is " + result.toFixed(1)
                        + "Please manually modify!");
                }
            }
        }
    }
    

    render(){
        return <button className="editor-menu__button" onClick={this.likelihoodCalculation}>Likelihood Calculation</button> 
    }
}

export default CORASCalculation;
    //export{}