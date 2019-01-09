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
		if (state === "Login") {
			return (<Login/>);
		} else if(state === "LobbyList") {
			return (<LobbyList/>);
		} else if (state === "Lobby") {
			return (<Lobby/>);
		} else {
			return (<Game/>);
		}
	}

	render() {
		return(
			<div>
				<nav className="text-center text-light shadow">
					<h2>Cards Against Humanity</h2>
				</nav>
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
