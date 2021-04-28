import React, { Component }  from 'react'
import { Link } from 'react-router-dom';

class Signup extends Component {
    constructor() {
        super();// here signup is child to parent class component, super() is a way to get all the elements/functions of Component in signup
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open:false
        };
    }

    handleChange=(name)=>(event)=>{
        this.setState({ [name]: event.target.value });

    }


    clickSubmit = (event) => {
        event.preventDefault();
        const { name, email, password } = this.state;
        const user = {// made new user with vals
            name:name,
            email:email,
            password:password
        };

        this.signup(user)
        .then(data=>{
            if(data.error)
            this.setState({error:data.error})
            else
            this.setState({
                name: "",
                email: "",
                password: "",
                error: "",
                open: true
            })
        })
    };

signup=(user)=>{
   return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: "POST",
            headers: {// to tell that content is json, not necessary, good practice
                Accept: "application/json",
                "Content-Type": "application/json"
                },
            body: JSON.stringify(user)
            })

            .then(response => {     //promise
                return response.json();
            })
            .catch(err => console.log(err));
}

render()
{ const { name, email, password, error, open } = this.state;

    return(
        <div className="container  col-xl-4">
            <h2 className="mt-5 mb-5">SignUp!</h2>

            <div className="alert alert-danger" style={{display:error?"":"none"}}>
                {error}
            </div>

            <div className="alert alert-success" style={{display:open?"":"none"}}>
                New account made! Please <Link to="/signin">Login</Link>
            </div>
            <form>
                <div className="form-group">
                    <label className='text-muted'>Name</label>
                    <input type="text" onChange={this.handleChange('name')} className="form-control" value={this.state.name}></input>
                </div>
                <div className="form-group">
                    <label className='text-muted'>Email</label>
                    <input type="email" onChange={this.handleChange('email')} className="form-control" value={this.state.email}></input>
                </div>
                <div className="form-group">
                    <label className='text-muted'>Password</label>
                    <input type="password"  onChange={this.handleChange('password')} className="form-control" value={this.state.password}></input>
                </div>

            <button onClick={this.clickSubmit} className="btn btn-raised btn-success">Sign in</button>

            </form>
        </div>
    )
}

};



export default Signup