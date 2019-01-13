import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../Libs/Request";

import joinLobby from "../../actions/joiningLobby";

class RegisterModal extends Component{
    constructor() {
        super();
        this.nameRef = React.createRef();
        this.passRef = React.createRef();
        $(document).ready(function() {
            $('#register').on('shown.bs.modal', function () {
                $(this).find("input:text")[0].focus();
            })
        });
    }

    async onConfirm(e) {
        if(e) {
            e.preventDefault();
        }

        let p = new Post("/register");
        p.data = {
            username: this.nameRef.current.value,
            password: this.passRef.current.value
        };
        await p.send();
    }

    onEnter() {
        if(e.key === "Enter") {
            this.onConfirm();
        }
    }

    render() {
        return (
            <form onKeyPress={this.onEnter.bind(this)}>
                <div class="form-group">
                    <i class="fas fa-user"></i><label>Username</label>
                    <input type="text" ref={this.nameRef} min="4" max="16" class="form-control" placeholder="My Username"/>
                </div>
                <div class="form-group">
                    <i class="fas fa-unlock"></i><label>password</label>
                    <input type="password" ref={this.passRef} min="4" max="16" class="form-control" placeholder="My Password"/>
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

export default connect(read, write)(RegisterModal);