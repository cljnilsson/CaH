import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import LobbyModal 			from "./Modals/LobbyModal";
import RegisterModal 		from "./Modals/RegisterModal";
import LoginModal 			from "./Modals/LoginModal";
import ChangeColorModal 	from "./Modals/ChangeColorModal";
import RulesModal			from "./Modals/RulesModal";
import ChangePasswordModal 	from "./Modals/ChangePasswordModal";

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
			case "Rules": {
                return RulesModal;
			}
			case "ChangePassword": {
                return ChangePasswordModal;
            }
        }
    }

    render() {
        let Body = this.body;
        return (
            <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="makeLobby" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title text-center" id="exampleModalLabel">{this.props.title}</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
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