import React, { Component } from 'react';
import { connect } from "react-redux"; // Read
import { bindActionCreators } from "redux"; // Write

import startGameClick from "../actions/startGameClick";
import startGame from "../actions/startGame";

import Chat from "./Partials/Chat";
import Users from "./Partials/Users";

import socket from "../Libs/io";

class Lobby extends Component {
    constructor() {
        super();
        socket.on("newGame", function(obj) {
            if(obj.destination == this.props.store.currentGame) {
                this.props.startGame(obj.users);
            }
        }.bind(this));
    }

    onClick() {
        this.props.startGameClick();
    }

    users() {
        return "test";
    }

    render() {
        return (
            <div>
                <div className="text-center border-bottom">
                    <h3>{this.props.store.currentGame}</h3>
                </div>
                    <Chat/>
                    <div className="row mt-3">
                        <div className="col text-center">
                            <button className="btn-lg btn-outline-light" onClick={this.onClick.bind(this)}>Start Game</button>
                        </div>
                    </div>
                </div>
        );
    }
}

function read(store) {
    return { store: store.general };
}

function write(dispatch) {
    return bindActionCreators({
        startGameClick: startGameClick,
        startGame: startGame
    }, dispatch);
}

export default connect(read, write)(Lobby);