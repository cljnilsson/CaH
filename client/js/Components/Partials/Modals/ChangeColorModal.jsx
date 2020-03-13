import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write

import {Post} from "../../../Libs/Request";

import changeColor from "../../../actions/changeColor";

class ChangeColorModal extends Component{
    constructor() {
		super();
		this.colorRef = React.createRef();
    }

    async onConfirm(e) {
        if(e) {
            e.preventDefault();
        }
		console.log("POSTING")
		console.log(this.colorRef)
		let p = new Post(`/${this.props.store.name}/changeColor`);
		console.log(this.colorRef.current.textContent)
        p.data = {
            color: this.colorRef.current.textContent,
        };
        let data = await p.send();
        let status = data.status;

        if(status === 200) {
            $('#changeColor').modal('hide');
            this.props.changeColor(this.colorRef.current.textContent)
        } else {
            // Display error in the future? although this should be impossible unless you manipulate the DOM which is not intended
        }
    }
    
    onEnter(e) {
        if(e.key === "Enter") {
            this.onConfirm();
		}
    }

	onClick(e) {
		let target = $(e.target)[0]
		let selText = target.textContent;
		this.colorRef.current.textContent = selText;
		$(this.colorRef.current).attr("class", `btn btn-outline-dark dropdown-toggle ${selText}`);
	}

	get colors() {
		let arr = ["paleturquoise", "red", "white", "green"];
		let html = [];
		let i = 0;
		for(let c of arr) {
			html.push(<small className={`dropdown-item ${c}`} key={i}>{c}</small>);
			i++;
		}
		return html;
	}

    render() {
        return (
            <div>
				<label className="sr-only">Username</label>
				<div className="input-group mb-2 mr-sm-2">
					<div className="input-group-prepend">
						<div className="input-group-text">Color</div>
					</div>
					<div className="btn-group">
						<button type="button" ref={this.colorRef} className="btn btn-outline-dark dropdown-toggle paleturquoise" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							paleturquoise
						</button>
						<div className="dropdown-menu" onClick={this.onClick.bind(this)}>
							{this.colors}
						</div>
					</div>
				</div>
				<button onClick={this.onConfirm.bind(this)} type="button" className="btn btn-primary">Submit</button>
			</div>
        );
    }
}

function read(store) {
	return{store: store.general};
}
  
function write(dispatch) {
	return bindActionCreators({
        changeColor: changeColor
	}, dispatch);
}

export default connect(read, write)(ChangeColorModal);