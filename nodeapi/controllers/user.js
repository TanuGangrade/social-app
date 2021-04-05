const User=require('../models/user')
const _ = require("lodash");

exports.userById=(req,res,next,id)=>{//id takes thes val of userId

    User.findById(id).exec((err,user)=>{

        if(err||!user){
            return res.send("user not found");
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

        res.send(users)
    }).select("name email updated created ")
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;//hide this
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body); // extend - update the person info w more info
    user.updated = Date.now();
    user.save(err => {
        if (err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action"
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ user });
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