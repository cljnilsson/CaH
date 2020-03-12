import React, { Component } 		from 'react';
import {connect} 					from "react-redux"; // Read
import {bindActionCreators} 		from "redux"; // Write

import Users 						from "./Users";

import joinLobby 					from "../../actions/joiningLobby";
import updateUsers 					from "../../actions/updateUsers";
import {newMessage, sendMessage} 	from "../../actions/message";

import socket 						from "../../Libs/io";
import classNames 					from "classnames";

class Chat extends Component {
    constructor() {
        super();
        this.nameRef 		= React.createRef();
        this.lastMessage 	= React.createRef();
        this.state 			= {};
        this.state.messages = [];

        this.onLeave 		= this.onLeave.bind(this);
        this.onJoin 		= this.onJoin.bind(this);
		this.onMessage 		= this.onMessage.bind(this);

        socket.on("userLeft"			, this.onLeave);
        socket.on("messageFromServer"	, this.onMessage);
		socket.on("userJoin"			, this.onJoin);
    }

    componentWillUnmount() {
        socket.removeListener("userLeft"			, this.onLeave);
        socket.removeListener("messageFromServer"	, this.onMessage);
		socket.removeListener("userJoin"			, this.onJoin);
    }

    get messages() {
        let store = this.props.store;
        return store.messages[store.currentGame];
    }

    set messages(messages) {
        this.props.newMessage(messages);
    }

    onJoin(x) {
        if(x.lobby == this.props.store.currentGame) {
            let messages = this.messages;
            messages.push({text: `${x.user} has joined!`});

            this.props.updateUsers(x.all);

            this.messages = messages;
        }
	}

    onLeave(obj) {
        if(obj.destination == this.props.store.currentGame) {
            this.props.updateUsers(obj.all);

            let messages = this.messages;
            messages.push({text: `${obj.user} has left!`});
            this.messages = messages;
        }
    }

    onMessage(x) {
        if(x.destination == this.props.store.currentGame) {
            let messages = this.messages
            messages.push({user: x.name, text: x.text});
            this.messages = messages;
        }
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

        this.messages.forEach(function(obj, i, arr) {
            let text;
            let ref = arr.length -1 === i ? this.lastMessage : "";
            if(obj.user) {
                let user = this.props.store.users.filter(u => u.name === obj.user)[0]
                text = <p ref={ref} className="mb-0"><b className={user.color ? user.color : ""}>{obj.user}</b>: {obj.text}</p>;
            } else {
                text = <p className="mb-0" ref={ref}>{obj.text}</p>;
            }
            all.push(text)
        }.bind(this));

        return all;
    }

    scrollToBottom = () => {
        if(this.lastMessage.current != null) {
            this.lastMessage.current.scrollIntoView({ behavior: "smooth" });
        }
      }
      
    componentDidMount() {
		this.scrollToBottom();
    }
      
    componentDidUpdate() {
		this.scrollToBottom();
    }

    render() {
        return (
            <div className="row">
                {this.props.bundleUsers === true ? <Users/> : ""}
                <div className="col">
                    <div className={(this.props.minified === true ? "miniChat" : "chat") + " text-left"}>
                        {this.chatMessages()}
                    </div>
                    <div className="row">
                        <div className="col pr-0">
                            <input className="form-control w-100 " ref={this.nameRef} type="text" onKeyPress={this.onEnter.bind(this)}></input>
                        </div>
                        <div className="col-md-auto pl-1 align-self-center">
                            <button className="btn-sm btn-outline-light" onClick={this.sendMessage.bind(this)}>Send</button>
                        </div>
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
        sendMessage: sendMessage,
        joinLobby: joinLobby,
        updateUsers: updateUsers,
		newMessage: newMessage,
		refresh: refresh
	}, dispatch);
}

export default connect(read, write)(Chat);