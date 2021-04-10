import React from "react";
import { Link, withRouter } from "react-router-dom";
//link is a substitute for <a href=> in react and it makes pages more smooth ans it dosent reload 
//all the re-routeing happens in the routs in switch in MainRouter.js

//history gives you what page you on 
const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: "#33cccc" };
    else return { color: "#ffffff" };
};

export const signout = (next) => {
    if (typeof window !== "undefined") localStorage.removeItem("jwt");//remove item with key of jwt, this is what we did in authenticate in signin.js
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {//http://localhost:8080
        method: "GET"
    })
        .then(response => {
            console.log("signout", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

//conditional show of login signin signout we check if they are authnticated

export const isAuth=()=>{
    if (typeof window == "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
}


const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/")} to="/" >
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/users")} to="/users" >
                    Users
                </Link>
            </li>
            {!isAuth() &&(
                <>
                <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">
                    Login
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link"  style={isActive(history, "/signup")} to="/signup" > 
                SignUp
                </Link>
            </li>
            </>
            )}
            
            {isAuth() &&(
            <>
              {/*to display name of current user */}
            
              <li className="nav-item ml-auto">
               <Link  className="nav-link" to={"/user/"+isAuth().founduser._id} style={{color:'white'}}
                      style={(isActive(history, "/user/"+isAuth().founduser._id))}>
                      {isAuth().founduser.name}'s profile 
                </Link>
                </li>


                <li className="nav-item ml">
                    <a className="nav-link "
                        style={
                            (isActive(history, "/signup"),
                            { cursor: "pointer", color: "#fff" })
                        }
                        onClick={() => {
                            signout(function (){ history.push("/")})// we send the function as parameter
                            }}
                    >
                        Sign Out
                    </a>
                </li>
                
              

             </>
            )}



        </ul>
    </div>
);

export default withRouter(Menu);