import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import joinLobby from "../actions/joiningLobby"

class LobbyList extends Component {
    constructor() {
        super();
        this.getLobbies();
        this.state = {lobbies: []};
    }
    
    onClick() {
        console.log("click");
        this.props.joinLobby();
    }

    async getLobbies() {
        let lobbies = await fetch("http://localhost:3001/lobby");
        lobbies = await lobbies.json();
        lobbies = lobbies.lobbies;

        let elementLobbies = [];
        for(let i = 0; i < lobbies.length; i++) {
            elementLobbies.push(
                <div className="container justify-content-center">
                    <div className="row animated fadeIn">
                        <div className="col align-self-center text-right font-weight-bold">
                            {lobbies[i].name} {lobbies[i].current}/{lobbies[i].max}
                        </div>
                        <div className="col align-self-center text-left">
                            <button className="btn-sm btn-outline-dark" onClick={this.onClick.bind(this)}>Join Game</button>
                        </div>
                    </div>
                </div>
            );
        }

        this.setState(function() {
            return {lobbies: elementLobbies};
        })
    }

    render() {
        return(
            <div>
                <h3 className="border-bottom text-center pb-1 mb-1">Lobbies</h3>
                {this.state.lobbies === [] ? <p>Loading</p> : this.state.lobbies}
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

export default connect(read, write)(LobbyList);