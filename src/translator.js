import React from 'react';
// import ReactDOM from 'react-dom';
import { Form, Button } from "react-bootstrap";

class Translator extends React.Component {
    constructor(props) {
        super(props);
     
        this.state = {
          rules: null,
          hs: null,
          as: null
        };
    }

    addToRule = () => {
        const json = JSON.parse(document.getElementById("json_rule").value);
        let prevRules = JSON.parse(localStorage.getItem("trans_rules"));
        if(prevRules===null) {
            prevRules = {};
        }
        Object.keys(json).forEach(key => {{}
            if(key in prevRules) {
                let refSet = new Set(prevRules[key]);
                json[key].forEach(val => refSet.add(val));                
                prevRules[key] = Array.from(refSet);
            } else {
                prevRules[key] = json[key];
            }
        });
        localStorage.setItem("trans_rules",JSON.stringify(prevRules));
    }

    translate = () => {
        let hs = document.getElementById("hindi_sentence").value.split(" ");
        let as = hs.map(ele => {
            return {word: ele, part: 0};
        });

        const max_phrase_length = 4;
        for(let l=max_phrase_length;l>=1;l--) {
            for(let i=0;i+l-1<as.length;i++) {
                const phrase_val = as.slice(i,i+l).map(ele => ele.word).join(" ");
                let flag = true;
                
                for(let marker=i;marker<=i+l-1;marker++) {
                    if(as[marker].part!==0) {
                        flag=false;
                        break;
                    }
                }

                if(flag && phrase_val in this.state.rules) {
                    as.splice(i,l,
                        ...this.state.rules[phrase_val][0].split(" ").map(ele => {
                            return {word: ele, part: l};
                        }));
                    // console.log(as);
                }


            }
        }

        hs = hs.map((val) => {
            return (<span>{val} </span>);
        });

        as = as.map(val => {
            let colorCode = "black";
            switch(val.part) {
                case 0:
                    colorCode = "black";
                    break;
                case 1:
                    colorCode = "green";
                    break;
                case 2:
                    colorCode = "blue";
                    break;
                case 3:
                    colorCode = "red";
                    break;
                case 4:
                    colorCode = "orange";
                    break;
                default:
                    break; 
            }
            return (<span title={`${val.part} word(s) long phrase`} style={{color: colorCode}}>{val.word} </span>);
        });

        this.setState({hs: hs, as: as});
    }

    render() {
       if(this.state.rules!==null) {
           return(
               <div>
                <div className="text-center my-5">
                    <h1>Hindi - Awadhi Translation Rules</h1>
                    <a style={{cursor: "pointer", color: "#f51010"}} href={window.location.host==="shikhar-scs.github.io" ? "/hindi-awadhi-translate" : "/"}>back to home</a>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-6">
                        <Form id="translate_form">
                            <Form.Label>Enter Hindi sentence</Form.Label>
                            <Form.Control id="hindi_sentence" placeholder="" defaultValue="तुम उसके लिए महान राजा के रूप में रहोगे और वह तुम्हारा अधिकृत वक्ता होगा।"/>
                        </Form>
                    </div>
                </div>
                <div className="mt-3 row d-flex justify-content-center">
                    <div className="col-6 text-center">
                        <Button onClick={() => {this.translate()}}>translate</Button>
                    </div>
                </div>
                <div className="mt-3 row d-flex justify-content-center">
                    <div className="col-6 text-center">
                        {this.state.hs}
                    </div>
                </div>
                <div className="mt-3 row d-flex justify-content-center">
                    <div className="col-6 text-center">
                        {this.state.as}
                    </div>
                </div>
               </div>
           );
       }
       return (
        <div>
            <div className="text-center my-5">
                <h1>Hindi - Awadhi Translator</h1>
                <a style={{cursor: "pointer", color: "#f51010"}} href={window.location.host==="shikhar-scs.github.io" ? "/hindi-awadhi-translate" : "/"}>back to home</a>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-8">
                    <Form>
                        <Form.Label>Enter JSON rule</Form.Label>
                        <Form.Control id="json_rule" placeholder="" defaultValue=""/>
                    </Form>
                </div>
            </div>
            <div className="mt-4 row d-flex justify-content-center">
                <div className="col-2 text-center">
                    <Button onClick={() => {this.addToRule()}}>Add</Button>
                </div>
                <div className="col-2 text-center">
                    <Button onClick={() => {this.setState({rules: JSON.parse(localStorage.getItem("trans_rules"))})}}className="btn-warning">Start Translation</Button>
                </div>
            </div>
        </div>
       )
    }
 }
 export default Translator;