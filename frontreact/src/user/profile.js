import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect,Link } from "react-router-dom";

class Profile extends Component{ 
    constructor() {
        super();
        this.state = {
            user: "",
            redirectToSignin: false
        };
    }

    

    componentDidMount() {
       const userId = this.props.match.params.userId;//to get the user id from the url
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
                this.setState({ redirectToSignin: true });
            } else {
                this.setState({ user: data });
            }
        })
        .catch(err=>console.log(err))
    }


    
    render(){
        const { redirectToSignin, user } = this.state;

        //if error(not allowed access)
        if (this.state.redirectToSignin) return <Redirect to="/signin" />;
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="mt-5 mb-5">Profile</h2>
                        <p>Hello {isAuthenticated().founduser.name}</p>
                <p>Email: {isAuthenticated().founduser.email}</p>
                <p>{`Joined ${new Date(
                    this.state.user.created
                ).toDateString()}`}</p>
            </div>


                    <div className="col-md-6">
                        {isAuthenticated().founduser &&// if the user is auth then local storage will exist
                            isAuthenticated().founduser._id == this.state.user._id && (
                                <div className="d-inline-block mt-5">
                                    <Link
                                        className="btn btn-raised btn-success mr-5"
                                        to={`/user/edit/${this.state.user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    <button className="btn btn-raised btn-danger">
                                        Delete Profile
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile