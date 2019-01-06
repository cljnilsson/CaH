import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

class BlackCard extends Component {
    onClick() {
        if(this.props.store.me.type === "Judge") {
            this.props.store.judgeSelected = this.props.owner;
        }
    }

    render() {
        return(
            <div onClick={this.onClick.bind(this)} tabindex={this.props.selectable === true ? "0" : "-1"} className={"card bg-dark text-white"}>
                <div className="card-body text-center">
                    <p className="card-text">{this.props.text}</p>
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
	}, dispatch);
}

export default connect(read, write)(BlackCard);