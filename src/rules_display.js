import React from 'react';
import ReactDOM from 'react-dom';

class RulesDisplay extends React.Component {
    constructor(props) {
        super(props);
     
        this.state = {
          data: null,
        };
    }

    componentDidMount() {
        fetch('/translation_rules.json')
          .then(response => response.json())
          .then(data => this.setState({ data }));
    }

    render() {
       if(this.state.data!==null) {
           return(
               <ul>
                   {
                       Object.keys(this.state.data).map((val, idx) => {
                       return(<li>{val} -> {this.state.data[val].join(", ")}</li>);
                       })
                   }
               </ul>
           );
       }
       return (
        <div className="text-center my-5">
            <h1>Hindi - Awadhi Translation Rules</h1>
        </div>
       )
    }
 }
 export default RulesDisplay;