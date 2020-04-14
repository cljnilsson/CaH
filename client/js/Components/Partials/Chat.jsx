import React, { Component, useState, useEffect}from 'react';
import {connect} 					from "react-redux"; // Read
import {bindActionCreators} 		from "redux"; // Write

import Linkify from 'react-linkify';

import Picker, { SKIN_TONE_MEDIUM_LIGHT }  from 'emoji-picker-react';
import Users 						from "./Users";

import joinLobby 					from "../../actions/joiningLobby";
import updateUsers 					from "../../actions/updateUsers";
import {newMessage, sendMessage} 	from "../../actions/message";

import socket 						from "../../Libs/io";
import classNames 					from "classnames";

function typeInTextarea(el, newText) {
	var start = el.prop("selectionStart")
	var end = el.prop("selectionEnd")
	var text = el.val()
	var before = text.substring(0, start)
	var after  = text.substring(end, text.length)
	el.val(before + newText + after)
	el[0].selectionStart = el[0].selectionEnd = start + newText.length
	el.focus()
  }

const Test = () => {
    const [chosenEmoji, setChosenEmoji] = useState(null);
 
	useEffect(() => {
		return () => {

		}
	});

    const onEmojiClick = (event, emojiObject) => {
		setChosenEmoji(emojiObject);

		console.log(emojiObject)

		let box = $("#textbox")[0];
		console.log(box)
		//console.log(typeInTextarea($(box), "xx"))

		typeInTextarea($(box), emojiObject.emoji)
    }
 
    return (
        <div>
            <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_LIGHT}/>
        </div>
    );
};

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
		let current = this.nameRef.current.value;
		if(current != "") {
			this.props.sendMessage(current)
			this.nameRef.current.value = ""
		}
    }

	onChange(e) {
		let target 	= $(e.target);
		let str 	= $(target).val();
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
				text = <p key={i} ref={ref} className="mb-0"><b className={user.color ? user.color : ""}>{obj.user}</b>: <Linkify>{obj.text}</Linkify></p>;
            } else {
                text = <p key={i} className="mb-0" ref={ref}>{obj.text}</p>;
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
                        <div className="col input-group">
                            <input id="textbox" className="form-control" ref={this.nameRef} onChange={this.onChange} type="text" onKeyPress={this.onEnter.bind(this)}></input>
							<div className="input-group-append">
								<div className="dropup">
									<button type="button" className="btn btn-outline-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										Emojis
									</button>
									<div className="dropdown-menu">
										<Test/>
									</div>
								</div>
								<button className="btn btn-outline-light" onClick={this.sendMessage.bind(this)}>Send</button>
							</div>
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
		newMessage: newMessage
	}, dispatch);
}

export default connect(read, write)(Chat);