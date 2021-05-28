const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({

    title:{
        type:String,
        required:"required",
        maxlength:30,
        minlength:1
    },
    body:{
        type:String,
        required:"needeeeeed",
        maxlength:2000,
        minlength:1
    },

    photo:{
        data:Buffer,//we will store the photo in binary
        // format in database so we can later extract and display when needed
        contentType:String
    },

    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"//this is a connection to the User schema
    },

    created:{
        type:Date,
        default:Date.now
    },

    updated:Date,

    likes:[{//array of users
        type:mongoose.Schema.ObjectId,ref:"User"}],

    comments:[{
        text:String,
        created:{type:Date,default:Date.now},
        postedBy:{ type:mongoose.Schema.ObjectId,ref:"User"}
    
    }]




});




module.exports=mongoose.model("Post",postSchema)