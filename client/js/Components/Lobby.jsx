import React, { Component } from 'react';
import { connect } from "react-redux"; // Read
import { bindActionCreators } from "redux"; // Write
import sendMessage from "../actions/sendMessage"

import startGameClick from "../actions/startGameClick"
import startGame from "../actions/startGame"
import newUser from "../actions/newUser"

import socket from "../Libs/io"

socket.on("text")

class Lobby extends Component {
    constructor() {
        super();
        this.nameRef = React.createRef();
        this.state = {};
        this.state.messages = [];

        socket.on("newGame", function(obj) {
            if(obj.destination == this.props.store.currentGame) {
                this.props.startGame();
            }
        }.bind(this));

        socket.on("userLeft", function(obj) {
            if(obj.destination == this.props.store.currentGame) {
                let messages = this.state.messages
                messages.push({text: `${obj.user} has left!`});
                this.setState({
                    messages: messages
                });
            }
        }.bind(this));

        socket.on("messageFromServer", function(x) {
            if(x.destination == this.props.store.currentGame) {
                let messages = this.state.messages
                messages.push({user: x.name, text: x.text});
                this.setState({
                    messages: messages
                });
            }
        }.bind(this));

        socket.on("userJoin", function(x) {
            if(x.lobby == this.props.store.currentGame) {
                let messages = this.state.messages
                messages.push({text: `${x.user} has joined!`});
                this.setState({
                    messages: messages
                });
                this.props.store.users.push(x.user);
                //this.props.newUser(x.user)
            }
        }.bind(this));
    }

    onClick() {
        this.props.startGameClick();
    }

    sendMessage() {
        this.props.sendMessage(this.nameRef.current.value)
        this.nameRef.current.value = ""
    }

    onEnter(e) {
        if(e.key === "Enter") {
            this.sendMessage();
        }
    }

    chatMessages() {
        let all = [];

        this.state.messages.forEach(function(obj) {
            let text;
            if(obj.user) {
                text = <p className="mb-0"><b>{obj.user}</b>: {obj.text}</p>;
            } else {
                text = <p className="mb-0">{obj.text}</p>;
            }
            all.push(text)
        });

        return all;
    }

    render() {
        return (
            <div>
                <div className="text-center border-bottom">
                    <h3>{this.props.store.currentGame}</h3>
                </div>
                <div className="chat">
                    {this.chatMessages()}
                </div>¨
                <div className="row">
                    <div className="col pr-0">
                        <input className="form-control w-100 " ref={this.nameRef} type="text" onKeyPress={this.onEnter.bind(this)}></input>
                    </div>
                    <div className="col-md-auto pl-1 align-self-center">
                        <button className="btn-sm btn-primary" onClick={this.sendMessage.bind(this)}>Send</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button className="btn-lg btn-primary" onClick={this.onClick.bind(this)}>Start</button>
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
        sendMessage: sendMessage,
        startGameClick: startGameClick,
        startGame: startGame,
        newUser: newUser
    }, dispatch);
}

export default connect(read, write)(Lobby);