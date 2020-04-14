import React, { Component } from 'react';
import {connect} 			from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import classNames 	from "classnames";

import joinLobby 	from "../../actions/joiningLobby";
import toIndex		from "../../actions/toIndex";
import {Post} 		from "../../Libs/Request";

class LobbyEntry extends Component {
    async onClick(e) {
		this.props.joinLobby(this.props.name);

		let p = new Post(`/${this.props.store.name}/joinGame`);
		
		p.data = {
			user: this.props.store.name, lobby: this.props.name
		}

		let resp = await p.send();

		if(resp.status != 200) { //this should never happen unless server is restarted and the user has not refreshed the site
			this.props.toIndex();
		}
    }

    get button() {
        if(this.props.full === true) {
            return "";
        } else {
            return <button className="btn btn-sm btn-outline-light" onClick={this.onClick.bind(this)}>Join Game</button>;
        }
    }

    render() {
		let sizeClasses = classNames({
			"text-success": this.props.sizeState === "Full" ? true : false,
			"text-muted": this.props.sizeState !== "Full" ? true : false,
			"mt-0": true,
			"form-text": true
		});

        return (
            <div className="row animated fadeIn">
                <div className="col align-self-center text-right font-weight-bold">
                    <span>{this.props.title}</span>
                    <small className={sizeClasses}>{this.props.sizeState}</small>
                </div>
                <div className="col align-self-center text-left pl-0">
                    {this.button}
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
		joinLobby: joinLobby,
		toIndex: toIndex
	}, dispatch);
}

export default connect(read, write)(LobbyEntry);