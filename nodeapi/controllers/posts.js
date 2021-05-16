const Post=require('../models/posts')
const formidable = require('formidable');
const fs=require("fs")//filesystem
const _ = require("lodash");


exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .populate("comments","text created")
        .populate("comments.postedBy",'_id name')
        .select("_id title body created likes")
        .sort({created:-1})//so the posts that are latest will come at the top
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};


exports.createPost=(req,res)=>{
    let form=new formidable.IncomingForm();//give incoming form fields
    form.keepExtensions=true;

    form.parse(req, (err, fields, files) => {//req has the form data,, fields is name, email etc
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
              }
        
        let post = new Post(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);//we read from form and store in the photo for that post model
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
    
}

//--------------------------------------------------------------------------------
//whenever therer is postId in url this is fired
exports.postById = (req, res, next, id) => {// from router.param
    Post.findById(id)
        .populate("postedBy", "_id name")
        .populate("comments","text created")
        .populate("comments.postedBy",'_id name')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};


//all posts by 1 user
exports.postsByUser = (req, res) => {
  const posts= Post.find({ postedBy: req.profile._id })//each post has posted by
        .populate("postedBy", "_id name")
        .select("_id title body created likes")
        .sort("_created")//sorted by date creatd
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};


exports.isPoster=(req,res,next)=>{ //to verify if the post is being deleted by the user wo made it 
    let isPoster =
    req.post && req.auth && req.post.postedBy._id == req.auth._id;

if (!isPoster) {
    return res.status(403).json({
        error: "User is not authorized"
    });
}

next();
}

// exports.updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};



exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Post deleted successfully'
        });        
    });
};

exports.photo=(req,res,next)=>{
    res.set("Content-Type",req.post.photo.contentType);
    return res.send(req.post.photo.data)
    
}

exports.singlePost=(req,res)=>{
    return res.json(req.post)
}


exports.like = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.body.userId } },
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            res.json(result);
        }
    });
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.body.userId } },
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            res.json(result);
        }
    });
};


exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId,
        { $push: { comments: comment } },
        { new: true }
    ).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: { _id: comment._id } } },
        { new: true }
    )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};









