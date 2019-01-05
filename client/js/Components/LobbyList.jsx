import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Get} from "../Libs/Request";

import LobbyEntry from "./Partials/LobbyEntry"
import Modal from "./Partials/Modal";
import joinLobby from "../actions/joiningLobby"

class LobbyList extends Component {
    constructor() {
        super();
        this.getLobbies();
        this.state = {lobbies: []};
    }
    
    async getLobbies() {
        let lobbies = await new Get("/lobby").send();
        lobbies = await lobbies.json();
        lobbies = lobbies.lobbies;

        let elementLobbies = [];
        for(let i = 0; i < lobbies.length; i++) {
            let title = `${lobbies[i].name} ${lobbies[i].current}/${lobbies[i].max}`;
            let name  = lobbies[i].name;

            elementLobbies.push(
                <LobbyEntry name={name} title={title}/>
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
                <div className="row">
                    <div className="col text-right">
                        <button className="btn btn-outline-light" data-toggle="modal" data-target="#makeLobby">Make Lobby</button>
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

export default connect(read, write)(LobbyList);