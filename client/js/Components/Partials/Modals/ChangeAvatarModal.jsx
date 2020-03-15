import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../../Libs/Request";

import faker from "faker";

import joinLobby from "../../../actions/joiningLobby";

class ChangeAvatarModal extends Component {
    constructor() {
        super();
        this.passConfirmRef = React.createRef();
		this.passRef 		= React.createRef();
		this.state = {error: ""};
    }

    onConfirm(e) {
		console.log(this.file)
        if(e) {
            e.preventDefault();
		}
		if(this.file != undefined) {
			let d = new FormData();
			d.append("file", this.file, this.file.name);
			fetch(`/${this.props.store.name}/changeAvatar`, {
				method: 'POST',
				body: d
			  })
		}
    }

    onEnter(e) {
        if(e.key === "Enter") {
            this.onConfirm();
        }
	}
	
	onChange(e) {
		this.file = e.target.files[0];
	}

    render() {
        return (
			<div>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text">Upload</span>
					</div>
					<div className="custom-file">
						<input type="file" className="custom-file-input" accept="image/png, image/jpeg" onChange={this.onChange.bind(this)}/>
						<label className="custom-file-label">Choose file</label>
					</div>
				</div>
				<input onClick={this.onConfirm.bind(this)} className="btn btn-outline-dark" name="submit" value="Upload"/>
			</div>
        );
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
	}, dispatch);
}

export default connect(read, write)(ChangeAvatarModal);