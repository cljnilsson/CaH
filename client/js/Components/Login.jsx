import React, { Component } from 'react';
import {connect} from "react-redux"; // Read
import {bindActionCreators} from "redux"; // Write
import {Post} from "../Libs/Request";
import confirmName from "../actions/confirmName";

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

class Login extends Component {
    constructor(props) {
        super(props);
        this.nameRef = React.createRef();
        let cookie = getCookie("username");
        if(cookie != "") {
            this.cookieLogin(cookie);
        }
    }

    async cookieLogin(cookie) {
        let p = new Post("/cookieLogin");
        p.data = {
            username: cookie
        };
        let data= await p.send();
        let status = data.status;
        data = await data.json();
        data = data.data;
        if(status === 200) {
            this.props.store.color = data.color;
            this.props.store.avatar = data.avatar;
            this.props.confirmName(cookie);
        }
    }

    onSubmit() {
        let name = this.nameRef.current.value;
        console.log(name);
        this.props.confirmName(name);
    }

    onEnter(e) {
        if(e.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        return(
            <div>
                <div className="row">
                    <div className="col text-center">
                        <h3>Select Username</h3>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-5 align-self-center">
                        <input type="text" className="form-control" onKeyPress={this.onEnter.bind(this)} placeholder="Username" maxLength="12" ref={this.nameRef}/>
                    </div>
                    <div className="col-md-auto pl-0">
                        <button className="btn btn-outline-light" onClick={this.onSubmit.bind(this)}>Submit</button>
                    </div>
                </div>
                <div className="row text-right">
                    <div className="col">
                        <button className="btn-sm btn-outline-light mr-3" data-toggle="modal" data-target="#login">Login</button>
                        <button className="btn-sm btn-outline-light" data-toggle="modal" data-target="#register">Register</button>
                    </div>

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
        confirmName: confirmName
	}, dispatch);
}

export default connect(read, write)(Login);