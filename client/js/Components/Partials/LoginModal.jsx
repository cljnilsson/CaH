import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../Libs/Request";

import confirmName from "../../actions/confirmName";

class LoginModal extends Component{
    constructor() {
        super();
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.state = {error: ""};
        $(document).ready(function() {
            $('#login').on('shown.bs.modal', function () {
                console.log($(this).find("input:text"));
                $(this).find("input:text")[0].focus();
            })
        });
    }

    get error() {
        if(this.state.error != "") {
            return <div className="text-center"><small>{this.state.error}</small></div>;
        } else {
            return "";
        }
    }

    async onConfirm(e) {
        if(e) {
            e.preventDefault();
        }
        let p = new Post("/login");
        p.data = {
            username: this.usernameRef.current.value,
            password: this.passwordRef.current.value,
        };
        let data= await p.send();
        let status = data.status;
        data = await data.json();

        if(status === 200) {
            $('#login').modal('hide');
            this.props.store.avatar = data.avatar;
            this.props.confirmName(this.usernameRef.current.value);
        } else {
            this.setState({...this.state, error: data.error});
        }
    }
    
    onEnter(e) {
        if(e.key === "Enter") {
            this.onConfirm();
        }
    }

    render() {
        return (
            <form onKeyPress={this.onEnter.bind(this)}>
                {this.error}
                <div class="form-group">
                    <i class="fas fa-user"></i><label>Username</label>
                    <input type="text" ref={this.usernameRef} class="form-control" placeholder="My Username" autofocus />
                </div>
                <div class="form-group">
                    <i class="fas fa-unlock"></i><label>password</label>
                    <input type="password" ref={this.passwordRef} class="form-control" placeholder="My Password"/>
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
        confirmName: confirmName
	}, dispatch);
}

export default connect(read, write)(LoginModal);