import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import joinLobby from "../../actions/joiningLobby"

class LobbyEntry extends Component {
    onClick(e) {
        console.log(this.props.name); 
        this.props.joinLobby(this.props.name);
    }

    get button() {
        if(this.props.full === true) {
            return "";
        } else {
            return <button className="btn-sm btn-outline-light" onClick={this.onClick.bind(this)}>Join Game</button>;
        }
    }

    render() {
        return (
            <div className="row animated fadeIn">
                <div className="col align-self-center text-right font-weight-bold">
                    <span>{this.props.title}</span>
                    <small className="form-text text-muted mt-0">{this.props.sizeState}</small>
                </div>
                <div className="col align-self-center text-left pl-0">
                    {this.button}
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