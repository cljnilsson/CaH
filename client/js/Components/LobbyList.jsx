import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Get}  from "../Libs/Request";
import socket from "../Libs/io";

import LobbyEntry  from "./Partials/LobbyEntry"
import joinLobby   from "../actions/joiningLobby";
import updateLobby from "../actions/updateLobby";

class LobbyList extends Component {
    constructor() {
        super();
        this.getLobbies();
        this.state = {filter: ""};
        
        this.input = React.createRef();

        this.onNewLobby = this.onNewLobby.bind(this);

        socket.on("newLobby", this.onNewLobby);
    }

    onNewLobby(lobbies) {
        this.props.updateLobby(lobbies.all);
    }

    get lobbiesToHTML() {
        let lobbies = this.props.store.lobbies;
        let elementLobbies = [];
        for(let i = 0; i < lobbies.length; i++) {
            let name  = lobbies[i].name;
            if(name.toLowerCase().includes(this.state.filter) === true) {
                let title = `${lobbies[i].name} ${lobbies[i].current}/${lobbies[i].max}`;
                let state = "";

                if(lobbies[i].current >= lobbies[i].max) {
                    state = "Full";
                } else if(lobbies[i].current === "0") {
                    state = "Empty";
                } else {
                    state = "In Progress";
                }
    
                elementLobbies.push(
                    <LobbyEntry key={i} name={name} title={title} sizeState={state}/>
                );
            }
        }

        return elementLobbies;
    }
    
    async getLobbies() {
        let lobbies = await new Get("/lobby").send();
        lobbies = await lobbies.json();
        lobbies = lobbies.lobbies;
        this.props.updateLobby(lobbies);
    }

    onType() {
        console.log(this.input.current.value);
        let txt = this.input.current.value.toLowerCase();

        this.setState({...this.state, filter: txt});
    }

    render() {
        return(
            <div>
                <div className="row border-bottom">
                    <div className="col">
                        <h3 className="m-0">Lobbies</h3>
                    </div>
                    <div className="col-3">
                        <input id="lobbySearch" className="form-control form-control-sm" ref={this.input} onInput={this.onType.bind(this)} type="text" placeholder="Search"/>
                    </div>
                </div>
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