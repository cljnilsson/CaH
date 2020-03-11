import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import LobbyModal from "./Modals/LobbyModal";
import RegisterModal from './Modals/RegisterModal';
import LoginModal from './Modals/LoginModal';
import ChangeColorModal from "./Modals/ChangeColorModal"

class Modal extends Component {
    get body() {
        switch(this.props.body) {
            case "Lobby": {
                return LobbyModal;
            }
            case "Register": {
                return RegisterModal;
            }
            case "Login": {
                return LoginModal;
			}
			case "ChangeColor": {
                return ChangeColorModal;
            }
        }
    }

    render() {
        let Body = this.body;
        return (
            <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="makeLobby" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-center" id="exampleModalLabel">{this.props.title}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <Body/>
                </div>
                </div>
            </div>
        </div>
        );
    }
}

function read(store) {
	return{};
}
  
function write(dispatch) {
	return bindActionCreators({
	}, dispatch);
}

export default connect(read, write)(Modal);