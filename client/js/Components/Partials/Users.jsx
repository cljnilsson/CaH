import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

class Users extends Component {
    render() {
        console.log(this.props.store.users.length);
        console.log(this.props.store.users);
        let users = [];
		for(let i = 0; i < this.props.store.users.length; i++) {
			let u = this.props.store.users[i];
			let prefix = u.type === "Judge" ? "(" + u.type + ") " : "";
			users.push(<p>{prefix}{u.name}</p>)
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