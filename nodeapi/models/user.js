const mongoose=require('mongoose')
const uuidv1 = require('uuidv1')
const crypto=require('crypto')


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,//this removes any '  ' before the name
        required:true
    },

    email:{
        type:String,
        trim:true,//this removes any '  ' before the name
        required:true
    },

    hashed_password:{
        type:String,
        required:true
    },

    salt:String,

    created:{
        type:Date,
        default:Date.now
    },

    updated:Date,

    photo:{
        data:Buffer,
        contentType:String
    },
    about:{
        type:String,
        trim:true
    },

    following:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],

    followers:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],

    resetPasswordLink: {
        data: String,
        default: ""
    }
})

//virtual field for password: virtual fields are additional fields for a model schema
//virtual properties (eg password) are not stored in database, they only exist logically
//here we take password, hash w the time, and store da hashed pass
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#defining_getters_and_setters

userSchema.virtual('password')
    .set(function(password){
       ///create temporary variable called _password
        this._pass=password

        this.salt=uuidv1()//unique time stamp 

        this.hashed_password=this.encryptPassword(password)

    })

    .get(function(){
        return this._password
    })

userSchema.methods={
    authenticate:function(plainText){
        return this.encryptPassword(plainText)==this.hashed_password
    },

    encryptPassword: function(password){
        if(!password) return "";
        try{
           return crypto.createHmac('sha1', this.salt)
           .update(password)
           .digest('hex');
        }
        catch(err){
            return ""
        }
    }
    

    }
module.exports=mongoose.model("User",userSchema)