import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Get} from "../Libs/Request";

// Components
import BlackCard from "./Partials/BlackCard";
import WhiteCard from "./Partials/WhiteCard";
import Users     from "./Partials/Users";

// Actions
import loadedCardsAction from "../actions/recievedCards"
import confirmSelection from "../actions/confirmCardSelection"

class Game extends Component {
    constructor(props) {
        super(props);
		this.getCards();
    }

    async getCards() {
		let store = this.props.store;
		let cards = await new Get(`/${store.currentGame}/${store.name}/cards`).send();
		cards = await cards.json();
		this.props.cardsFinishedLoading(cards);
	}

	get confirmButton() {
		return(
		<div className="row">
			<div className="col text-center mb-3">
				<button className="btn btn-lg btn-outline-light mt-5" onClick={this.onClick.bind(this)}>Confirm</button>
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
		let lookFor = "___"; // Make sure it matches card format
		let selection = this.props.store.selection;
		let fill = this.props.store.cards.blackCards[0].text;
		if(selection !== undefined) {
			selection.forEach(function(card) {
				let index  = fill.indexOf(lookFor);
				let prefix = fill.substring(0, index);
				let suffix = fill.substring(index + lookFor.length);

				fill = prefix + card.props.text + suffix;
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

	onClick() {
		this.props.confirmSelection({type: "CONFIRM_SELECTION"});
	}

    render() {
        if(this.props.store.waiting !== false) {
            return "Loading..";
        } else {
            return(
                <div className="text-center">
                    <div className="row">
                        <Users/>
                        {this.game}
                    </div>
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
		confirmSelection: confirmSelection
	}, dispatch);
}

export default connect(read, write)(Game);