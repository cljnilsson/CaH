import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import classNames from "classnames";

// Actions
import {updateCardSelection} from "../../actions/cards"

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
        if(this.props.disabled != true) {
            this.color = this.color === WhiteCard.greySettings ? WhiteCard.default : WhiteCard.greySettings;
            if(this.isWithinSelectionLimit()) {
                this.updateCounter();
                this.props.updateSelection(this);
            }
        }
    }
    
    render() {
        let classes = classNames({
			"card": true,
			"text-dark": true,
            "border-dark": true,
            "animated fadeIn": this.props.animate != false,
        });
        return(
            <div className={classes + " " + this.color} onClick={this.onClick.bind(this)}>
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
		updateSelection: updateCardSelection
	}, dispatch);
}

export default connect(read, write)(WhiteCard);