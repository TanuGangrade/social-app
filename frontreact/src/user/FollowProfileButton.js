import React, { Component } from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="d-inline-block">
                {!this.props.following ? (//we got the following prop from profile.js
                    <button
                        onClick={this.followClick}
                        className="btn btn-info btn-raised m-5" style={{backgroundColor:"#ff6699"}}
                    >
                        Follow
                    </button>
                ) : (
                    <button
                        onClick={this.unfollowClick}
                        className="btn btn-outline-info m-5" style={{borderColor:"#ff6699", color:"red"}}
                    >
                        UnFollow
                    </button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;