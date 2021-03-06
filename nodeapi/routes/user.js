const express=require('express')
const router=express.Router();
const {userById,allUsers,userPhoto, getUser, updateUser,deleteUser
        ,addFollowing, addFollower,removeFollowing, removeFollower
        ,findPeople}=require('../controllers/user')
const {requireSignin}=require('../controllers/auth')


router.get('/users',allUsers)
router.get('/user/:userId',requireSignin,getUser)
router.put('/user/:userId',requireSignin,updateUser)
router.delete('/user/:userId',requireSignin,deleteUser)
router.get("/user/photo/:userId",userPhoto)
router.put('/user/follow/:userId', requireSignin,addFollowing, addFollower )
router.put('/user/unfollow/:userId', requireSignin,removeFollowing, removeFollower )
router.get('/user/findpeople/:userId',requireSignin,findPeople)



//authorization 
//userById() will execute whenever we encounter a parameter 
//called userId - when calling perticular user info /:userId
router.param("userId",userById)

module.exports=router;
