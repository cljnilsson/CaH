import React, { Component } from 'react';
import { connect } from "react-redux"; // Read
import { bindActionCreators } from "redux"; // Write

import {startGame, startGameClick} from "../actions/startGame";

import Chat  from "./Partials/Chat";
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
        return <button className="btn btn-lg btn-outline-light animated fadeIn" onClick={this.onClick.bind(this)}>Start Game</button>
    }

    buttonIfHost () {
        let html = "";

        if(this.props.store.me !== undefined && this.props.store.me.type === "Judge") {
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
                <div className="row border-bottom">
                    <div className="col text-center">
                        <h3>{this.props.store.currentGame}</h3>
                    </div>
                </div>
                <div className="row pl-1 pt-2">
                    <Users/>
                    <div className="col">
                        <Chat/>
                        {this.buttonIfHost()}
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