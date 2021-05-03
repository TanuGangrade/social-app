import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect,Link } from "react-router-dom";
import DefaultProfile from "../images/UserAvatar.png";
import DeleteUser from "./deleteUser"
import FollowProfileButton from "./FollowProfileButton"
import ProfileTabs from "./ProfileTabs"

class Profile extends Component{ 
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: ""
        };
    }


    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id;
        });
        return match;
    };

    clickFollowButton = callApi => {// call api is the follow ir unfollow methd gotten from FollowProfileButton.js
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id)
        .then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ user: data, following: !this.state.following });// if button is follow we make it unfollow and vise wersa
            }
        });
    };

    


 init=(userId)=>{
        fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
            method:"GET",
            headers:{ Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated().token}` //in nodeapi to get in we needed Bearer + token.
            //isAuthin just has the info that is stored in local storage
                    }
           })
           .then(response => {
            return response.json(); //return to data v
        })
        .then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });//if wrong url then it is directed to signin 
            } else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following:following });
            }
        })
        .catch(err=>console.log(err))

    }
    

    componentDidMount() {
       const userId = this.props.match.params.userId;//to get the user id from the url
      this.init(userId)
    }

    componentWillReceiveProps(props){
        const userId = props.match.params.userId;
        this.init(userId)
    }



    
    render(){
        const { redirectToSignin, user } = this.state;

        //if error(not allowed access)
        if (this.state.redirectToSignin) return <Redirect to="/signin" />;
       
        const photoURL =this.state.user._id ? `${ process.env.REACT_APP_API_URL
        }/user/photo/${this.state.user._id}?${new Date().getTime()}` //new date makes the photo change whenever its updated (remove from local storage)
      : DefaultProfile;


        return (
            <div className="container">
            <h2 className="mt-5 mb-5">Profile 🌸</h2>

                <div className="row">
                    <div className="col-md-6">
                    <img src={photoURL} style={{width:"300px",height:"300px" ,objectFit: "cover"}} className="img-thumbnail"
                     alt={this.state.user.name} onError={i=>{i.target.src=`${DefaultProfile}`}}
                    />
                  
                    </div>

                    <div className="col-md-6 mt-3">
                    <div className="lead mt-5 ml-5">
                        <p>Hi ! I'm {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>{`Joined ${new Date(
                            this.state.user.created
                        ).toDateString()}`}</p>
                    </div>
                        {isAuthenticated().user &&// if the user is auth then local storage will exist
                            isAuthenticated().user._id === this.state.user._id
                             ? (
                                <div className="d-inline-block mt-5 mb-5">
                                    <Link
                                        className="btn btn-raised btn-success mr-5"
                                        to={`/user/edit/${this.state.user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    
                                        <DeleteUser userId={user._id}/>
                                   
                                </div>
                            ):
                            <FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton} />
                            }
                            
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />
                      
                        <ProfileTabs followers={this.state.user.followers} following={this.state.user.following}/>
                
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile