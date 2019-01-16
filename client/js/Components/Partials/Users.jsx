import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

class Users extends Component {
	getUser(data) {
		if(data.avatar) {
			return <span className={data.color}>{data.name}</span>;
		} else {
			return <span>{data.name}</span>;
		}
	}

	getAvatar(data) {
		if(data.avatar) {
			return <img class="avatarSmall" src={"/" + data.avatar}/>
		} else {
			return "";
		}

	}

    render() {
        let users = [];
		for(let i = 0; i < this.props.store.users.length; i++) {
			let u = this.props.store.users[i];
			let prefix = u.type;
			users.push(
			<div className="row border-bottom">
				<div className="col">
					<div className="row align-items-center">
						<div className="col text-center">
						{this.getAvatar(u)}
						{this.getUser(u)}
						</div>
					</div>
					<div className="row">
						<div className="col">
							{prefix}
						</div>
						<div className="col text-right">
							{u.points}
						</div>
					</div>
				</div>
			</div>
			);
		}
        return(
            <div className="col-2 text-center border-right">
				{users}
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

export default connect(read, write)(Users);