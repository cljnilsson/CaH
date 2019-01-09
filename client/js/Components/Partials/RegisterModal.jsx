import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../Libs/Request";

import joinLobby from "../../actions/joiningLobby";

class RegisterModal extends Component{
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
        return (
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Name</label>
                    <input type="text" ref={this.nameRef} min="4" max="16" class="form-control" id="exampleInputEmail1"  placeholder="My cool game name"/>
                </div>
                <div class="form-group">
                    <label for="exampleFormControlSelect1">Max Size</label>
                    <select ref={this.sizeRef} class="form-control" id="exampleFormControlSelect1">
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </div>
                <button onClick={this.onConfirm.bind(this)} type="button" class="btn btn-primary" data-dismiss="modal">Submit</button>
            </form>
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

export default connect(read, write)(RegisterModal);