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
            <div>
                <div className="row">
                    <div className="col text-center">
                        <h3>Select Username</h3>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-5 align-self-center">
                        <input type="text" className="form-control" onKeyPress={this.onEnter.bind(this)} placeholder="Username" maxLength="12" ref={this.nameRef}/>
                    </div>
                    <div className="col-md-auto pl-0">
                        <button className="btn btn-outline-light" onClick={this.onSubmit.bind(this)}>Submit</button>
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