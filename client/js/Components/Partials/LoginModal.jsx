import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../Libs/Request";

import joinLobby from "../../actions/joiningLobby";

class LoginModal extends Component{
    constructor() {
        super();
        this.nameRef = React.createRef();
        this.sizeRef = React.createRef();
    }

    async onConfirm(e) {
        e.preventDefault();
        let p = new Post("/lobby");
        p.data = {
            host: this.props.store.name,
            name: this.nameRef.current.value,
            max: Array.from(this.sizeRef.current.children).filter(child => child.selected === true)[0].text
        };
        let data= await p.send();
        console.log(data);
        this.props.joinLobby(this.nameRef.current.value);
    }

    render() {
        return (""
        );
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
        joinLobby: joinLobby
	}, dispatch);
}

export default connect(read, write)(LoginModal);