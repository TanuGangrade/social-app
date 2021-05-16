
import React, { Component } from "react";
import { singlePost,remove,like,unlike } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { Link,Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./comment"


class SinglePost extends Component{
    state = {
        post: '',
        redirectToHome: false,
        redirectToSignin:false,
        like:false,
        likes:0,
        comments:[]//comments of each post
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;//find in likes array
        return match;
    };


    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ post: data,likes:data.likes.length ,like:this.checkLike(data.likes),
                                comments:data.comments});
            }
        });
    }; 

    updateComments= comments=>{
        this.setState({comments:comments})
    }

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };


    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (answer) {
            this.deletePost();
        }
    };




 renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        return (
            <div className="card-body">
                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    className="img-thunbnail mb-3"
                    style={{
                        width: "50%",
                        objectFit: "cover",
                       // border:"6px solid black",
                        borderRadius:"5px"
                    }}
                />

                

                <p className="card-text" style={{whiteSpace:"pre-wrap"}}>{post.body}</p>
                

                {this.state.like ? (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-heart text-warning  "
                            style={{ padding: "10px",paddingLeft:"0px", borderRadius: "50%" , color: "tomato"}}
                        />{" "}
                        {this.state.likes} {this.state.likes==1?<span> Like</span>:<span> Likes</span>}
                    </h3>
                ) : (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="far fa-heart  "
                            style={{ padding: "10px",paddingLeft:"0px", borderRadius: "50%", color:"gray" }}
                        />{" "}
                        {this.state.likes} {this.state.likes==1?<span> Like</span>:<span> Likes</span>}
                    </h3>
                )}

                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.created).toDateString()}
                </p>

                

                {/* buttons */}
                <div className="d-inline-block">
                    <Link
                        to={`/`}
                        className="btn btn-raised btn-info btn-sm mr-5"
                    >
                        Back to posts
                    </Link>

                    {isAuthenticated().user &&
                        isAuthenticated().user._id === post.postedBy._id && (
                            <>
                            <Link  to={`/post/edit/${post._id}`} className="btn btn-raised btn-success btn-sm mr-5">
                             Edit Post
                            </Link>
                                <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                    Delete Post
                                </button>
                            </>
                        )}
                 </div>
            </div>
        );
    };

    render() {
        if (this.state.redirectToHome) {
            return <Redirect to={`/`} />;
        }
        if (this.state.redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        const { post } = this.state;
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}

                <Comment postId={this.state.post._id} comments={this.state.comments.reverse()} updateComments={this.updateComments}/>
            </div>
        );
    }
}
export default SinglePost