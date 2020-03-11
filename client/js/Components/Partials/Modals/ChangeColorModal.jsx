import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../../Libs/Request";

import confirmName from "../../../actions/confirmName";

class ChangeColorModal extends Component{
    constructor() {
        super();
    }

    async onConfirm(e) {
        if(e) {
            e.preventDefault();
        }
       // Add functionality here
    }
    
    onEnter(e) {
        if(e.key === "Enter") {
            this.onConfirm();
        }
    }

    render() {
        return (
            <form class="form-inline">
				<label class="sr-only" for="inlineFormInputGroupUsername2">Username</label>
				<div class="input-group mb-2 mr-sm-2">
					<div class="input-group-prepend">
						<div class="input-group-text">@</div>
					</div>
					<div class="btn-group">
						<button type="button" class="btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Action
						</button>
						<div class="dropdown-menu">
							<small class="dropdown-item">Torq</small>
						</div>
					</div>
				</div>
			</form>
        );
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
        confirmName: confirmName
	}, dispatch);
}

export default connect(read, write)(ChangeColorModal);