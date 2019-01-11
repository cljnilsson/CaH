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
    }

    async onConfirm(e) {
        e.preventDefault();
        let p = new Post("/login");
        p.data = {
            username: this.usernameRef.current.value,
            password: this.passwordRef.current.value,
        };
        let data= await p.send();
        console.log(data);
    }

    render() {
        return (
            <form>
                <div class="form-group">
                    <i class="fas fa-user"></i><label>Username</label>
                    <input type="text" ref={this.usernameRef} min="4" max="16" class="form-control" placeholder="My Username"/>
                </div>
                <div class="form-group">
                    <i class="fas fa-unlock"></i><label>password</label>
                    <input type="password" ref={this.passwordRef} min="4" max="16" class="form-control" placeholder="My Password"/>
                </div>
                <button onClick={this.onConfirm.bind(this)} type="button" class="btn btn-primary" data-dismiss="modal">Submit</button>
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