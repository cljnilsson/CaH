import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Get} from "../Libs/Request";
import socket from "../Libs/io";

import LobbyEntry from "./Partials/LobbyEntry"
import Modal from "./Partials/Modal";
import joinLobby from "../actions/joiningLobby"

class LobbyList extends Component {
    constructor() {
        super();
        this.getLobbies();
        this.state = {lobbies: []};
        
        this.onNewLobby = this.onNewLobby.bind(this);

        socket.on("newLobby", this.onNewLobby);
    }

    onNewLobby(lobbies) {
        this.props.store.lobbies = lobbies.all;
        this.lobbiesToHTML(lobbies.all);

    }

    lobbiesToHTML(lobbies) {
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
    
    async getLobbies() {
        let lobbies = await new Get("/lobby").send();
        lobbies = await lobbies.json();
        this.props.store.lobbies = lobbies;
        lobbies = lobbies.lobbies;

        this.lobbiesToHTML(lobbies);
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
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
        joinLobby: joinLobby
	}, dispatch);
}

export default connect(read, write)(LobbyList);