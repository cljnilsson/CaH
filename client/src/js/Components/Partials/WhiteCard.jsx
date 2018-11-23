import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

// Actions
import updateSelection from "../../actions/updateCardSelection"

class WhiteCard extends Component {
    static greyCards = [];

    static greySettings     = "bg-secondary text-white";
    static default          = ""; 

    constructor(props) {
        super(props);
        this.state = {
            settings: ""
        }
    }

    updateCounter() {
        let color = this.color;

        if(color === WhiteCard.greySettings) {
            WhiteCard.greyCards.push(this);
        } else {
            let index = WhiteCard.greyCards.indexOf(this);
            WhiteCard.greyCards.splice(index, 1);
        }
    }

    isWhite() {
        return this.color === WhiteCard.default;
    }

    isGrey() {
        return this.color === WhiteCard.greySettings;
    }

    isWithinSelectionLimit() {
        return WhiteCard.greyCards.length < 2;
    }

    isSelectable() {
        return this.isGrey() && this.isWithinSelectionLimit();
    }

    onClick() {
        this.color = this.state.settings === WhiteCard.greySettings ? WhiteCard.default : WhiteCard.greySettings;
        if(this.isSelectable() || this.isWhite()) {
            this.setState({
                settings: this.color
            });
            this.updateCounter();
            this.props.updateSelection(WhiteCard.greyCards);
        }
    
    }
    
    render() {
        return(
            <div className={"card border-dark " + this.state.settings} onClick={this.onClick.bind(this)}>
                <div className="card-body text-center">
                    <p className="card-text">{this.props.text}</p>
                </div>
            </div>
        );
    }
}

function read(store) {
	return{};
}
  
function write(dispatch) {
	return bindActionCreators({
		updateSelection: updateSelection
	}, dispatch);
}

export default connect(read, write)(WhiteCard);