  
import React, { Component } from "react";
import { Redirect } from "react-router";
import { isAuthenticated } from "../auth";
import DefaultProfile from "../images/UserAvatar.png";

class editProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error:"",
            loading:false,
            fileSize:0

        };
    }
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
                this.setState({ redirectToProfile: true });//if wrong url then it is directed to signin 
            } else {
                this.setState({ id: data._id, name: data.name, 
                                email: data.email,error:'' ,
                            about:data.about});
            }
        })
        .catch(err=>console.log(err))

    }
    

    componentDidMount() {
        this.userData=new FormData();
       const userId = this.props.match.params.userId;//to get the user id from the url
      this.init(userId)
    }

    isValid = () => {
        const { name, email, password,fileSize } = this.state;

        if (fileSize>1000000) {//1 mb
            this.setState({loading:false})
            this.setState({ error: "File size should be less then 1 mb" });
            return false;
        }

        if (name.length === 0) {
            this.setState({ error: "Name is required",loading:false });
            return false;
        }
        // email@domain.com
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {//apply regular expression check(test) on 'email'
            this.setState({ error: "A valid Email is required" ,loading:false });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({
                error: "Password must be at least 6 characters long",loading:false 
            });
            return false;
        }
        return true;
    };



    handleChange=(name)=>(event)=>{
        this.setState({error: ""})
        this.setState({loading:false})        
        const value =
        name === "photo" ? event.target.files[0] : event.target.value;
        
        
        const fileSize= name === "photo" ? event.target.files[0].size : 0;
        
        this.userData.set(name, value);
        this.setState({ [name]: event.target.value ,fileSize:fileSize});

    }

    updateUser = (user, next) => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem("jwt")) {
                let auth = JSON.parse(localStorage.getItem("jwt"));
                auth.user = user;
                localStorage.setItem("jwt", JSON.stringify(auth));
                next();
            }
        }
    };

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading:true})

        if(this.isValid()){
        
        const userId = this.props.match.params.userId;
        const token=isAuthenticated().token;

        this.update(userId,token,this.userData)
        .then(data=>{
            if(data.error)
            this.setState({error:data.error})
            else
            this.updateUser(data, () => {
                this.setState({
                    redirectToProfile: true
                });
            });
        })

        
    }
    };

    update=(userId,token,user)=>{
        return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))

    }


   render(){

    if(this.state.redirectToProfile)
    {
       return <Redirect to={`/user/${this.state.id}`}/>
    }

    const photoURL =this.state.id ? `${ process.env.REACT_APP_API_URL
      }/user/photo/${this.state.id}?${new Date().getTime()}` //new date makes the photo change whenever its updated (remove from local storage)
    : DefaultProfile;
 
   return (
    <div className="container  col-xl-4">
    <h2 className="mt-5 mb-5">Edit</h2>

    <div className="alert alert-danger" style={{display:this.state.error?"":"none"}}>
                {this.state.error}
   </div>

    {this.state.loading?
    <div className="jumbotron text-center"><h2>Loading...</h2></div> 
    : ""}

<img src={photoURL} style={{width:"300px",objectFit: "cover"}} className="img-thumbnail" alt={this.state.name}
  onError={i=>{i.target.src=`${DefaultProfile}`}}

/>


<form>

    <div className="form-group">
        <label className='text-muted'>Profile Photo</label>
        <input type="file" onChange={this.handleChange('photo')} className="form-control" accept="image/*"></input>
    </div>

    <div className="form-group">
        <label className='text-muted'>Name</label>
        <input type="text" onChange={this.handleChange('name')} className="form-control" value={this.state.name}></input>
    </div>
    <div className="form-group">
        <label className='text-muted'>Email</label>
        <input type="email" onChange={this.handleChange('email')} className="form-control" value={this.state.email}></input>
    </div>

    <div className="form-group">
        <label className='text-muted'>About</label>
        <textarea type="text" onChange={this.handleChange('about')} className="form-control" value={this.state.about}></textarea>
    </div>

    <div className="form-group">
        <label className='text-muted'>Password</label>
        <input type="password"  onChange={this.handleChange('password')} className="form-control" value={this.state.password}></input>
    </div>

<button onClick={this.clickSubmit} className="btn btn-raised btn-success">Update</button>

</form>
</div>
   )}

}

export default editProfile 