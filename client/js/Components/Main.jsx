import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import toIndex from "../actions/toIndex";
import logout from "../actions/logout";

// Components
import Login     from "./Login";
import LobbyList from "./LobbyList";
import Lobby     from "./Lobby";
import Game      from "./Game";

import Modal     from "./Partials/Modal";

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

class App extends Component {
	constructor(props) {
		super(props);
	}

	get content() {
		let store = this.props.store;
		let state = store.state;
		switch(state) {
			case "Login": {
				return (<Login/>);
			}
			case "LobbyList": {
				return (<LobbyList/>);
			}
			case "Lobby": {
				return (<Lobby/>);
			}
			default: {
				return (<Game/>);
			}
		}
	}

	get avatar() {
		if(this.props.store.avatar) {
			return <img className="avatar" src={"/" + this.props.store.avatar}/>;
		} else {
			return "";
		}
	}

	get loginState() {
		if(this.props.store.name != undefined) {
			return(
				<div className={"col align-self-center text-right " + this.props.store.color}>
					<div className="dropleft">
						<span id="userCorner" className="dropdown-toggle align-middle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.store.name}</span>{this.avatar}
						<div className="dropdown-menu">
							<button className="dropdown-item" type="button" data-toggle="modal" data-target="#changeColor">Select User Color</button>
							<button className="dropdown-item" type="button" data-toggle="modal" data-target="#changePassword">Change Password</button>
							<button className="dropdown-item" type="button" data-toggle="modal" data-target="#changeAvatar">Change Avatar</button>
							<button className="dropdown-item" type="button" onClick={this.logout.bind(this)}>Logout</button>
						</div>
					</div>
				</div>)
		} else {
			return "";
		}
	}

	logout() {
		eraseCookie("username");
		this.props.logout()
	}

	goToStart() {
		this.props.toIndex();
	}

	render() {
		return(
			<div>
				<div className="text-light shadow container-fluid">
					<div className="row justify-content-center">
						<div className="col">
							<h3 id="navbarBrand" onClick={this.goToStart.bind(this)}>Cards Against Humanity</h3>
						</div>
						{this.loginState}
					</div>
				</div>
				<div className="jumbotron text-light">
					<div className="App container align-items-center">
						{this.content}
					</div>
				</div>
				<Modal id="makeLobby" title="Create Lobby" body="Lobby"/>
				<Modal id="register" title="Register" body="Register"/>
				<Modal id="login" title="Login" body="Login"/>
				<Modal id="changeColor" title="Change Color" body="ChangeColor"/>
				<Modal id="rules" title="Rules" body="Rules"/>
				<Modal id="changePassword" title="Change Password" body="ChangePassword"/>
			</div>
		);
	}
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
		toIndex: toIndex,
		logout: logout
	}, dispatch);
}

export default connect(read, write)(App);
