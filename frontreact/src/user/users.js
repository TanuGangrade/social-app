import React, { Component } from "react";

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




    render(){
        return(
            <div className="container">
            <h2 className="mt-5 mb-5">All Users</h2>
            </div>
        )
        
    }
}

export default Users