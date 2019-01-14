import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

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
			return <div className={"col align-self-center text-right " + this.props.store.color}><small>{this.props.store.name}</small>{this.avatar}</div>
		} else {
			return "";
		}
	}

	render() {
		return(
			<div>
				<div className="text-light shadow container-fluid">
					<div className="row justify-content-center">
						<div className="col">
							<h3>Cards Against Humanity</h3>
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
			</div>
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

export default connect(read, write)(App);
