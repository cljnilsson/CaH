import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

class RulesModal extends Component{
    constructor() {
        super();
    }

    async onConfirm(e) {
        if(e) {
            e.preventDefault();
        }
       // Add functionality here
    }
    
    onEnter(e) {
        if(e.key === "Enter") {
            this.onConfirm();
        }
    }

    render() {
        return (
            <ul>
				<li>Each round a player is chosen as a 'judge'</li>
				<li>The judge will not participate during the round but will instead select the winner among the other players by choosing the funniest outcome</li>
				<li>The players will see a black card with an unfinished sentence or statement</li>
				<li>Each player has a unique selection of black cards which they select to complete the text on the black card.</li>
				<li>First to X points win</li>
			</ul>
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

export default connect(read, write)(RulesModal);