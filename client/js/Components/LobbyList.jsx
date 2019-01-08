import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Get} from "../Libs/Request";
import socket from "../Libs/io";

import LobbyEntry from "./Partials/LobbyEntry"
import Modal from "./Partials/Modal";
import joinLobby from "../actions/joiningLobby";
import updateLobby from "../actions/updateLobby";

class LobbyList extends Component {
    constructor() {
        super();
        this.getLobbies();
        
        this.onNewLobby = this.onNewLobby.bind(this);

        socket.on("newLobby", this.onNewLobby);
    }

    onNewLobby(lobbies) {
        this.props.updateLobby(lobbies.all);
    }

    get lobbiesToHTML() {
        let lobbies = this.props.store.lobbies;
        console.log(lobbies);
        let elementLobbies = [];
        for(let i = 0; i < lobbies.length; i++) {
            let title = `${lobbies[i].name} ${lobbies[i].current}/${lobbies[i].max}`;
            let full = lobbies[i].current >= lobbies[i].max;
            let name  = lobbies[i].name;

            elementLobbies.push(
                <LobbyEntry name={name} title={title} full={full}/>
            );
        }

        return elementLobbies;
    }
    
    async getLobbies() {
        let lobbies = await new Get("/lobby").send();
        lobbies = await lobbies.json();
        lobbies = lobbies.lobbies;
        console.log(lobbies);
        this.props.updateLobby(lobbies);
    }

    render() {
        return(
            <div>
                <h3 className="border-bottom text-center pb- mb-1">Lobbies</h3>
                {this.props.store.lobbies === [] ? <p>Loading</p> : <div className="pt-1">{this.lobbiesToHTML}</div>}
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
        joinLobby: joinLobby,
        updateLobby: updateLobby
	}, dispatch);
}

export default connect(read, write)(LobbyList);