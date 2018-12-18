import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import joinLobby from "../../actions/joiningLobby"

class LobbyEntry extends Component {
    onClick(e) {
        console.log(this.props.name); 
        this.props.joinLobby(this.props.name);
    }

    render() {
        return (
            <div className="container justify-content-center">
                <div className="row animated fadeIn">
                    <div className="col align-self-center text-right font-weight-bold">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="col align-self-center text-left">
                        <button className="btn-sm btn-outline-dark" onClick={this.onClick.bind(this)}>Join Game</button>
                    </div>
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
        joinLobby: joinLobby
	}, dispatch);
}

export default connect(read, write)(LobbyEntry);