import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Get}  from "../Libs/Request";
import socket from "../Libs/io";

// Components
import BlackCard from "./Partials/BlackCard";
import WhiteCard from "./Partials/WhiteCard";
import Users     from "./Partials/Users";
import Chat      from "./Partials/Chat";

// Actions
import loadedCardsAction                  from "../actions/recievedCards"
import {updateCards, confirmCards}        from "../actions/cards";
import {updateTurn, newTurn, endTurn}     from "../actions/turn";
import gameOver                           from "../actions/gameOver";

class Game extends Component {
	static confirmButton = "btn btn-lg btn-outline-light";

    constructor(props) {
        super(props);
		this.getCards();
		this.onNewCards = this.onNewCards.bind(this);
		this.onJudgeTurn = this.onJudgeTurn.bind(this);
		this.onNewTurn = this.onNewTurn.bind(this);
		this.onGameOver = this.onGameOver.bind(this);
		socket.on("updateCards", this.onNewCards);
		socket.on("judgeTurn", this.onJudgeTurn);
		socket.on("newTurn", this.onNewTurn);
		socket.on("gameOver", this.onGameOver);
	}

    async getCards() {
		let store = this.props.store;
		let cards = await new Get(`/${store.currentGame}/${store.name}/cards`).send();
		cards = await cards.json();
		this.props.cardsFinishedLoading(cards);
	}

	onNewCards(obj) {
		if(this.props.store.me.name === obj.user) {
			this.props.updateCards(obj.all);
		}
	}

	onJudgeTurn(obj) {
		if(this.props.store.currentGame === obj.game) {
			if(this.props.store.me.type === "Judge") {
				this.props.store.options = obj.options;
				this.props.store.optionOwners = obj.owners;
			}
			this.props.updateTurn("Judge");
		}
	}

	onNewTurn(obj) {
		if(obj.game === this.props.store.currentGame) {
			this.props.newTurn({users: obj.all, winner: obj.winner});
		}
	}

	onGameOver(obj) {
		if(obj.game === this.props.store.currentGame) {
			this.props.gameOver(obj.winner);
		}
	}

	get confirmButton() {
		return(
		<div className="row">
			<div className="col text-center mb-3">
				<button className={Game.confirmButton + " mt-5"} onClick={this.onClick.bind(this)}>Confirm</button>
			</div>
		</div>);
	}

	get whiteCards() {
		let whiteCards = this.props.store.cards.whiteCards
		let text = [];

		whiteCards.forEach(element => {
			let card;
			if(this.props.store.turn === "Judge") {
				card = <div className="col"><WhiteCard animate={false} disabled={true} text={element.text}/></div>
			} else {
				card = <div className="col"><WhiteCard text={element.text}/></div>;
			}
			text.push(card);
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
					<BlackCard selectable={false} text={this.blackCardText}/>
				</div>
			</div> 
		);
	}

	get blackCardText() {
		let minimal = [];
		this.props.store.selection.forEach(c => {
			minimal.push(c.props.text);
		});
		return this.replaceFiller(minimal);
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

	get choices() {
		let all = [];
		this.props.store.options.forEach((o, i) => {
			let str = <div className="col-5"><BlackCard owner={this.props.store.optionOwners[i]} selectable={true} text={this.replaceFiller(o)}/></div>
			all.push(str);
		});
		return all;
	}

	get content() {
		let store = this.props.store;
		if(store.me.type === "Player") {
			if(store.submitted === false && store.turn === "Players") {
				return this.game;
			} else {
				if(store.turn === "Judge") {
					return (
					<div>
						<p className="text-center">Waiting for Judge</p>
						{this.whiteCards}
					</div>);
				} else {
					return "Waiting for other players";
				}
			}
		} else {
			if(store.turn === "Judge") {
				return(
					<div className="col">
						<div className="row text-center justify-content-center pt-3 pb-3">
							{this.choices}
						</div>
						<div className="row text-center">
							<button className={Game.confirmButton} onClick={this.onJudgeConfirm.bind(this)}>Confirm</button>
						</div>
					</div>
				);
			} else {
				return "You are the judge!";
			}
		}
	}

	replaceFiller(fillWith) {
		let lookFor = "____"; // Make sure it matches card format
		let selection = fillWith;
		let fill = this.props.store.cards.blackCards[0].text;
		if(selection !== undefined) {
			selection.forEach(function(card) {
				let index  = fill.indexOf(lookFor);
				let prefix = fill.substring(0, index);
				let suffix = fill.substring(index + lookFor.length);

				fill = prefix + card + suffix;
			})
		}
		return fill;
	}

	onJudgeConfirm() {
		this.props.endTurn();
	}

	onClick() {
		this.props.store.selection.forEach(card => {
			card.color = "";
		});
		this.props.confirmSelection();
	}

    render() {
        if(this.props.store.waiting !== false) {
            return "Loading..";
        } else if(this.props.store.state === "GameOver") {
			return `${this.props.store.winner} won the game!`;
		} else {
            return(
                <div className="text-center">
                    <div className="row border-bottom pb-3">
                        <Users/>
						{this.content}
                    </div>
					<Chat minified={true}/>
                </div>
            );
        }
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
		cardsFinishedLoading: loadedCardsAction,
		confirmSelection: confirmCards,
		updateTurn: updateTurn,
		endTurn: endTurn,
		newTurn: newTurn,
		gameOver: gameOver,
		updateCards: updateCards
	}, dispatch);
}

export default connect(read, write)(Game);