import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import confirmName from "../actions/confirmName"

class Login extends Component {
    constructor() {
        super();
        this.nameRef = React.createRef();
    }

    onSubmit() {
        let name = this.nameRef.current.value;
        console.log(name);
        this.props.confirmName(name);
    }

    onEnter(e) {
        if(e.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        return(
            <div className="row justify-content-center">
                <div className="text-center pb-3 col-5">
                    <h3>Select a usename</h3>
                    <div className="form-inline justify-content-center">
                        <input type="text" className="form-control" onKeyPress={this.onEnter.bind(this)} placeholder="Username" maxLength="12" ref={this.nameRef}/>
                        <button className="btn btn-primary" onClick={this.onSubmit.bind(this)}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

function read(store) {
	return{};
}
  
function write(dispatch) {
	return bindActionCreators({
        confirmName: confirmName
	}, dispatch);
}

export default connect(read, write)(Login);