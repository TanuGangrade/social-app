import React, { Component } from "react";
import DefaultProfile from "../images/UserAvatar.png";
import {Link} from 'react-router-dom'
import{findPeople,follow} from "./apiUser"
import {isAuthenticated} from '../auth'

class FindPeople extends Component{

        constructor() {
            super();
            this.state = {
                users: [],
                error:"",
                open:false
            };
        }
       

        componentDidMount() {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
    
            findPeople(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ users: data });
                }
            });
        }

        clickFollow = (user, i) => {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
    
            follow(userId, token, user._id).then(data => {
                if (data.error) { 
                    this.setState({ error: data.error });
                } 
                else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);//splice out the user who we clicked
                    this.setState({//ovewrite
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`
                    });
                }
            });
        };

    render() {
        const { users } = this.state;

        const photoURL =this.state.id ? `${ process.env.REACT_APP_API_URL
        }/user/photo/${this.state.id}?${new Date().getTime()}` //new date makes the photo change whenever its updated (remove from local storage)
      : DefaultProfile;

        return (
                <div className="container ">
                    <h2 className="mt-5 mb-5">Users</h2>
    
                    <div className="row">
                        {users.map((user, i) => (
                            <div className="card  m-3" style={{width: "18rem"}} key={i}>
                            <img src={`${ process.env.REACT_APP_API_URL}/user/photo/${user._id}`} style={{width:"300px", height:"300px",objectFit: "cover"}} className="img-thumbnail" alt={user.name}
                                onError={i=>{i.target.src=`${DefaultProfile}`}}
                            />

                                <div className="card-body">
                                    <h5 className="card-title" style={{textTransform: "capitalize"}}>{user.name}</h5>
                                    <p className="card-text">{user.email}</p>
                                    <Link to={`/user/${user._id}`}
                                    className="btn btn-dark btn-raised btn-sm">View</Link>
                               
                               

                                <button
                                onClick={() => this.clickFollow(user, i)}
                                className="btn btn-raised btn-info float-right btn-sm"
                                 >
                                Follow
                                 </button>
                                 </div> 
                            </div>
                        ))}
                    </div>
                </div>
        );
    }
}

export default FindPeople