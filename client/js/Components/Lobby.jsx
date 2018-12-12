import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

class Lobby extends Component {
    constructor() {
        super();
    }
    
    render() {
        return(
            <div>
                <h3>{this.props.store.currentGame}</h3>
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

export default connect(read, write)(Lobby);