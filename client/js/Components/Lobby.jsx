import React, { Component } from 'react';
import { connect } from "react-redux"; // Read
import { bindActionCreators } from "redux"; // Write
import sendMessage from "../actions/sendMessage"
import socket from "../Libs/io"

socket.on("text")

class Lobby extends Component {
    constructor() {
        super();
        this.nameRef = React.createRef();
        this.state = {};
        this.state.messages = [];
        socket.on("messageFromServer", function(x) {
            if(x.destination == this.props.store.currentGame) {
                let messages = this.state.messages
                messages.push({user: x.name, text: x.text});
                this.setState({
                    messages: messages
                });
            }
        }.bind(this));
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
            all.push(<p className="mb-0">{obj.user}: {obj.text}</p>)
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
                    <div className="col">
                        <input className="form-control w-100 " ref={this.nameRef} type="text" onKeyPress={this.onEnter.bind(this)}></input>
                    </div>
                    <div className="col-md-auto align-self-center">
                        <button className="btn-sm btn-primary" onClick={this.sendMessage.bind(this)}>Send</button>
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
        sendMessage: sendMessage
    }, dispatch);
}

export default connect(read, write)(Lobby);