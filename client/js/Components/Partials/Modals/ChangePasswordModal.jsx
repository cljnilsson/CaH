import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../../Libs/Request";

import faker from "faker";

import joinLobby from "../../../actions/joiningLobby";

class ChangePasswordModal extends Component{
    constructor() {
        super();
        this.passConfirmRef = React.createRef();
        this.passRef 		= React.createRef();
        /*$(document).ready(function() {
            $('#register').on('shown.bs.modal', function () {
                $(this).find("input:text")[0].focus();
            })
        });*/
    }

    async onConfirm(e) {
        if(e) {
            e.preventDefault();
        }
		console.log(this.passRef.current.value)
        //let p = new Post("/changePassword");
        p.data = {
            password: this.passRef.current.value
        };
        //await p.send();
    }

    onEnter() {
        if(e.key === "Enter") {
            this.onConfirm();
        }
    }

    render() {
        return (
            <form onKeyPress={this.onEnter.bind(this)}>
                <div className="form-group">
                    <input type="password" ref={this.passRef} min="4" max="16" className="form-control" placeholder="My Password"/>
					<input type="password" ref={this.passConfirmRef} min="4" max="16" className="form-control pt-1" placeholder="Repeat Password"/>
                </div>
                <button onClick={this.onConfirm.bind(this)} type="button" className="btn btn-primary" data-dismiss="modal">Submit</button>
            </form>
        );
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
	}, dispatch);
}

export default connect(read, write)(ChangePasswordModal);