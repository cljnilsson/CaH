import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write


class Lobby extends Component {
    render() {
        return(
            <div>
                game
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

export default connect(read, write)(Lobby);