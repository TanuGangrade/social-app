const User=require('../models/user')
const _ = require("lodash");
const formidable = require('formidable');
const fs=require("fs")//filesystem

exports.userById=(req,res,next,id)=>{//id takes thes val of userId

    User.findById(id)
    .populate('following','_id name')// what you wanna populate and what fields you want to populate
    .populate('followers','_id name')// what you wanna populate and what fields you want to populate
    .exec((err,user)=>{

        if(err||!user){
            return res.status(400).json({
                error: 'User not found'
            });
          }

        req.profile=user; // adds profile info in req for the requested id
        next();
    })
}

exports.hasAuthorization = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
};

exports.allUsers=(req,res)=>{
    User.find((err,users)=>{
        if(err){
            return res.json({error:err})
        }

        res.json(users)
    }).select("name email updated created ")
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;//hide this
    req.profile.salt = undefined;
    return res.json(req.profile);
};


exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save user
        let user = req.profile; // anytime u have user if in url
        
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });
};


exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "User deleted successfully" });
    });
};

exports.userPhoto=(req,res,next)=>{
    if(req.profile.photo.data){//user has uploaded profile

        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data)
    }
    next();
}

exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId,{ $push: { following: req.body.followId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        }
    );
};

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId,{ $push: { followers: req.body.userId } },
        { new: true }// once we update we want to show the new data and this is how we do that
    )
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        { $pull: { following: req.body.unfollowId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        }
    );
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: req.body.userId } },
        { new: true }
    )
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};


exports.findPeople=(req,res)=>{

    let following=req.profile.following
    following.push(req.profile._id)// so now following has all the user ids that are not to be suggested for
    //someone to follow

    User.find({_id:{$nin:following}}, (err,users)=>{
        if(err){return res.status(400).json({error:err})}

        res.json(users)//this returns all the users that are not followed
    }).select("name")

}
