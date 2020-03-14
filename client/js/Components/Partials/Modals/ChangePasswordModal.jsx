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
		this.state = {error: ""};

        /*$(document).ready(function() {
            $('#register').on('shown.bs.modal', function () {
                $(this).find("input:text")[0].focus();
            })
        });*/
    }

    onConfirm(e) {
        if(e) {
            e.preventDefault();
		}

		if(this.passRef.current.value === this.passConfirmRef.current.value) {
			$(function () {
				$('#changePassword').modal('toggle');
			});

			let p = new Post(`/${this.props.store.name}/changePassword`);
			p.data = {
				password: this.passRef.current.value
			};
			
			p.send();
		} else {
			this.passRef.current.value = "";
			this.passConfirmRef.current.value = "";
			this.setState({error: <div class="alert alert-danger" role="alert">Passwords must match</div>});
		};
    }

    onEnter(e) {
        if(e.key === "Enter") {
            this.onConfirm();
        }
    }

    render() {
        return (
            <form onKeyPress={this.onEnter.bind(this)}>
                <div className="form-group">
					{this.state.error}
                    <input type="password" ref={this.passRef} min="4" max="16" className="form-control" placeholder="My Password"/>
					<input type="password" ref={this.passConfirmRef} min="4" max="16" className="form-control mt-2" placeholder="Repeat Password"/>
                </div>
                <button onClick={this.onConfirm.bind(this)} type="button" className="btn btn-primary">Submit</button>
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