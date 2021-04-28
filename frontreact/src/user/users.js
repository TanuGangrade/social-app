import React, { Component } from "react";
import DefaultProfile from "../images/UserAvatar.png";
import {Link} from 'react-router-dom'

class Users extends Component{

        constructor() {
            super();
            this.state = {
                users: []
            };
        }
       

     componentDidMount() {
        return fetch(`${process.env.REACT_APP_API_URL}/users`, {
            method: "GET"
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ users: data });
                }
            })
            .catch(err => console.log(err));

        }




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
                            <img src={`${ process.env.REACT_APP_API_URL}/user/photo/${user._id}`} style={{width:"300px"}} className="img-thumbnail" alt={user.name}
                                onError={i=>{i.target.src=`${DefaultProfile}`}}
                            />

                                <div className="card-body">
                                    <h5 className="card-title" style={{textTransform: "capitalize"}}>{user.name}</h5>
                                    <p className="card-text">{user.email}</p>
                                    <Link to={`/user/${user._id}`}
                                    className="btn btn-dark btn-raised btn-sm">View</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        );
    }
}

export default Users