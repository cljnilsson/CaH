import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../Libs/Request";

import joinLobby from "../../actions/joiningLobby";

class LoginModal extends Component{
    constructor() {
        super();
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.state = {error: ""};
    }

    get error() {
        if(this.state.error != "") {
            return <div className="text-center"><small>{this.state.error}</small></div>;
        } else {
            return "";
        }
    }

    async onConfirm(e) {
        e.preventDefault();
        let p = new Post("/login");
        p.data = {
            username: this.usernameRef.current.value,
            password: this.passwordRef.current.value,
        };
        let data= await p.send();
        let error = await data.json();
        console.log(data);
        console.log(error);
        if(data.status === 200) {
            $('#login').modal('hide');
            // Update store
        } else {
            this.setState({...this.state, error: error});
        }
    }

    render() {
        return (
            <form>
                {this.error}
                <div class="form-group">
                    <i class="fas fa-user"></i><label>Username</label>
                    <input type="text" ref={this.usernameRef} min="4" max="16" class="form-control" placeholder="My Username"/>
                </div>
                <div class="form-group">
                    <i class="fas fa-unlock"></i><label>password</label>
                    <input type="password" ref={this.passwordRef} min="4" max="16" class="form-control" placeholder="My Password"/>
                </div>
                <button onClick={this.onConfirm.bind(this)} type="button" class="btn btn-primary">Submit</button>
            </form>
        );
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
        joinLobby: joinLobby
	}, dispatch);
}

export default connect(read, write)(LoginModal);