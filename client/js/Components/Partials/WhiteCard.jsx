import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

// Actions
import updateSelection from "../../actions/updateCardSelection"

class WhiteCard extends Component {
    static greySettings     = "bg-secondary text-white";
    static default          = ""; 

    constructor(props) {
        super(props);
    }

    updateCounter() {
        if(this.isGrey()) {
            console.log("adding");
            this.props.store.selection.push(this);
        } else {
             this.props.store.selection = this.props.store.selection.filter(c => c !== this);
        }
    }

    isWhite() {
        return this.color === WhiteCard.default;
    }

    isGrey() {
        return this.color === WhiteCard.greySettings;
    }

    isWithinSelectionLimit() {
        return this.props.store.selection.length < 2;
    }

    isSelectable() {
        return this.isGrey() && this.isWithinSelectionLimit();
    }

    onClick() {
        this.color = this.color === WhiteCard.greySettings ? WhiteCard.default : WhiteCard.greySettings;
        if(this.isWithinSelectionLimit()) {
            this.updateCounter();
            this.props.updateSelection(this);
        }
    }
    
    render() {
        return(
            <div className={"card border-dark animated fadeIn " + this.color} onClick={this.onClick.bind(this)}>
                <div className="card-body text-center">
                    <p className="card-text">{this.props.text}</p>
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
		updateSelection: updateSelection
	}, dispatch);
}

export default connect(read, write)(WhiteCard);