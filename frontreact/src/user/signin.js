import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from 'react-router-dom';

class signin extends Component {
    constructor() {
        super();// here signin is child to parent class component, super() is a way to get all the elements/functions of Component in signup
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading:false
        };
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    authenticate(jwt, next) {//jwt is data, next is the function -() => {  this.setState({ redirectToReferer: true 
        if (typeof window !== "undefined") {
            localStorage.setItem("jwt", JSON.stringify(jwt));//name,value
            next();//setItem is proveided by browser, and we can store the user data onto that brouser local
            //storage temporarily so that we can use later
        }
    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading:true});
        const { email, password } = this.state;
        const user = {// made new user with vals
            email:email,
            password:password
        };

        this.signin(user)

        .then(data=>{//responce from nodeapi on making post req
            if (data.error) { //we do auth from node api, if error is found, it is stord in state and then the msg from nodeapi is displayed
                this.setState({ error: data.error,loading:false });
            } else {
                // authenticate
                this.authenticate(data, () => {//data has stringified user
                    this.setState({ redirectToReferer: true });
                });
            }
        });
    };

    signin = user => {
        return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
            method: "POST",
            headers: {// to tell that content is json, not necessary, good practice
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(response => {  //nodeapi sends back res.json(post)
                return response.json();
            })
            .catch(err => console.log(err));
    };

    signinForm = (email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-success"
            >
                Submit
            </button>
        </form>
    );

    render() {
        const { email, password, error, redirectToReferer,loading } = this.state;

        if (redirectToReferer) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container col-xl-4">
                <h2 className="mt-5 mb-5">Login</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>
            
                {this.state.loading?<div className="jumbotron text-center"><h2>Loading...</h2></div> : ""}


                {this.signinForm(email, password)}
                <Link to="/signup"><h3 >Sign up if you dont have an account!</h3></Link>
                <p>
                <Link to="/forgot-password" className="text-danger">
               <h4> Forgot Password</h4>
             </Link>
</p>

            </div>
        );
    }
}

export default signin;