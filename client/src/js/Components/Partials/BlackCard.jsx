import React, { Component } from 'react';

class BlackCard extends Component {
    render() {
        return(
            <div className={"card bg-dark text-white"}>
                <div className="card-body text-center">
                    <p className="card-text">{this.props.text}</p>
                </div>
            </div>
        );
    }
}

export default BlackCard;