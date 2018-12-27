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

    get startButton() {
        return <button className="btn-lg btn-outline-light" onClick={this.onClick.bind(this)}>Start Game</button>
    }

    buttonIfHost () {
        let html = "";

        if(this.props.store.me !== undefined && this.props.store.me.type === "Judge") {
            console.log(this.props.store.users.length);
            html = (
                <div className="row mt-3">
                    <div className="col text-center">
                        {this.props.store.users.length > 1 ? this.startButton : "Waiting for players..."}
                    </div>
                </div>
            );
        }

        return html;
    }

    onClick() {
        this.props.startGameClick();
    }

    render() {
        return (
            <div>
                <div className="text-center border-bottom">
                    <h3>{this.props.store.currentGame}</h3>
                </div>
                <Chat/>
                {this.buttonIfHost()}
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