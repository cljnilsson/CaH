import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import toIndex from "../actions/toIndex";

// Components
import Login     from "./Login";
import LobbyList from "./LobbyList";
import Lobby     from "./Lobby";
import Game      from "./Game";

import Modal     from "./Partials/Modal";

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
			return <img class="avatar" src={"/" + this.props.store.avatar}/>;
		} else {
			return "";
		}
	}

	get loginState() {
		if(this.props.store.name != undefined) {
			console.log(this.props.store);
			return(
				<div className={"col align-self-center text-right " + this.props.store.color}>
					<div class="dropleft">
						<span id="userCorner" class="dropdown-toggle align-middle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.store.name}</span>{this.avatar}
						<div class="dropdown-menu">
							<button class="dropdown-item" type="button" data-toggle="modal" data-target="#changeColor">Action</button>
						</div>
					</div>
				</div>)
		} else {
			return "";
		}
	}

	goToStart() {
		console.log("TETEÖLSTKLÖEKTLÖEÖL")
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
			</div>
		);
	}
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
		toIndex: toIndex
	}, dispatch);
}

export default connect(read, write)(App);
