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
            let messages = this.state.messages
            messages.push({user: x.name, text: x.text});
            this.setState({
                messages: messages
            });
        }.bind(this));
        console.log("LLLLLLL");
    }

    onEnter(e) {
        if(e.key === "Enter") {
            this.props.sendMessage({name: this.props.store.name, text: this.nameRef.current.value})
            this.nameRef.current.value = ""
        }
    }

    chatMessages() {
        let all = [];

        this.state.messages.forEach(function(obj) {
            all.push(<p>{obj.user}: {obj.text}</p>)
        });

        return all;
    }

    render() {
        return (
            <div className="text-center">
                <h3>{this.props.store.currentGame}</h3>
                 {this.chatMessages()}
                <input ref={this.nameRef} type="text" onKeyPress={this.onEnter.bind(this)}></input>
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