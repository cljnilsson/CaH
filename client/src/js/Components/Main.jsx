import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

// Components
import BlackCard from "./Partials/BlackCard";
import WhiteCard from "./Partials/WhiteCard";
import Login     from "./Login";
import LobbyList from "./LobbyList";
import Lobby     from "./Lobby";

// Actions
import getCardsAction from "../actions/getCards"
import loadedCardsAction from "../actions/recievedCards"
import confirmSelection from "../actions/confirmCardSelection"

class App extends Component {
	constructor(props) {
		super(props);
		this.props.cardsStartLoading();
		this.getCards();
	}

	async getCards() {
		let cards = await fetch("http://localhost:3001/cards")
		cards = await cards.json();
		this.props.cardsFinishedLoading(cards);
	}

	onClick() {
		this.props.confirmSelection({type: "CONFIRM_SELECTION"});
	}

	get confirmButton() {
		return(
		<div className="row">
			<div className="col text-center mb-3">
				<button className="btn btn-lg btn-outline-dark mt-5" onClick={this.onClick.bind(this)}>Confirm</button>
			</div>
		</div>);
	}

	get whiteCards() {
		let whiteCards = this.props.store.cards.whiteCards
		let text = [];

		whiteCards.forEach(element => {
			text.push(<div className="col"><WhiteCard text={element.text}/></div>);
		});
		return(
			<div className="row">
				{text}
			</div>
		);
	}

	get blackCard() {
		return(
			<div className="row text-center justify-content-center pt-3 pb-3">
				<div className="col-5">
					<BlackCard text={this.blackCardText}/>
				</div>
			</div> 
		);
	}

	get blackCardText() {
		let selection = this.props.store.selection;
		let fill = this.props.store.cards.blackCards[0].text;
		if(selection !== undefined) {
			selection.forEach(function(card) {
				let index = fill.indexOf("____");
				fill = fill.substring(0, index) + card.props.text + fill.substring(index + 4);
			})
		}
		return fill;
	}

	get game() {
		return(
			<div className="col">
				<h3>Hello, {this.props.store.name}</h3>
				{this.blackCard}
				{this.whiteCards}
				{this.confirmButton}
			</div>
		);
	}


	get users() {
		let users = [];
		for(let i = 0; i < this.props.store.users.length; i++) {
			users.push(<p>{this.props.store.users[i]}</p>)
		}
		return(
			<div className="col-2 text-center border-right">
				{users}
			</div>
		);
	}

	get ingame() {
		return(
			<div className="text-center">
				<div className="row">
					{this.users}
					{this.game}
				</div>
			</div>
		);
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
			if(store.waiting !== false) {
				return "";
			} else {
				return this.ingame;
			}
		}
	}

	render() {
		return(
			<div>
				<nav className="text-center">
					<h2>Cards Against Humanity</h2>
				</nav>
				<div className="jumbotron">
					<div className="App container align-items-center">
						{this.content}
					</div>
				</div>
			</div>
		);
	}
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
		cardsStartLoading: getCardsAction,
		cardsFinishedLoading: loadedCardsAction,
		confirmSelection: confirmSelection
	}, dispatch);
}

export default connect(read, write)(App);
