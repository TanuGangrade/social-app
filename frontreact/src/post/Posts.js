import React, { Component } from "react";
import { list } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            page: 1
        };
    }

    loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

   componentDidMount() {
        this.loadPosts(this.state.page);
    }

    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadPosts(this.state.page + number);
    };
 
    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadPosts(this.state.page - number);
    };

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy? `/user/${post.postedBy._id}`: "";
                    const posterName = post.postedBy? post.postedBy.name: " Unknown";

                    return (
                        <div className="card m-3"style={{width: "19rem"}} key={i}>
                            
                                <img
                                    src={`${
                                        process.env.REACT_APP_API_URL}/post/photo/${post._id}`}alt={post.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                    className="img-thunbnail" style={{width:"100%", height:"300px",objectFit: "cover"}}
                                />
                                <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    {post.body.substring(0, 100)}...
                                </p>
                                <br />
                                
                                <p className="font-italic ">
                                    Posted by{" "}
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link>
                                    
                                </p>
                                <Link
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-dark btn-sm"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { posts ,page} = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!posts.length ? "No more posts!" : "Recent Posts"}
                </h2>

                {this.renderPosts(posts)}

                 

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-info mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}
 
                {posts.length==6 ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}

            </div>
        );
    }
}

export default Posts;
