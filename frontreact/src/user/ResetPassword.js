import React, { Component } from "react";
import { resetPassword } from "../auth";
import { Link } from "react-router-dom";
 
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: ""
        };
    }
 
    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
 
        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };
 
    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Reset your Password</h2>
 
                {this.state.message && (
                   <div> <h4 style={{color:"green"}}>{this.state.message}</h4>
                    <Link to="/signin"><h3 style={{color:"#ff3399"}} >Login! </h3></Link>
                    </div>
                )}
                {this.state.error && (
                    <h4 style={{color:"red"}}>{this.state.error}</h4>
                )}
                    
               { !this.state.message&&(
                <form>
                    <div className="form-group mt-5">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Your new password"
                            value={this.state.newPassword}
                            name="newPassword"
                            onChange={e =>
                                this.setState({
                                    newPassword: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={this.resetPassword}
                        className="btn btn-raised btn-success"
                    >
                        Reset Password
                    </button>
                </form>
               )}

            </div>
        );
    }
}
 
export default ResetPassword;