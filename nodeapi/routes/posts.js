const {getPosts,createPost, postsByUser, postById ,isPoster,deletePost, updatePost }=require('../controllers/posts')
const express=require('express')
const router=express.Router();
const {createPostValidator}=require('../validator/index')
const {requireSignin}=require('../controllers/auth')
const {userById}=require('../controllers/user')


router.get('/posts',getPosts)

router.post('/post/new/:userId',requireSignin,createPost,createPostValidator)


router.get("/posts/by/:userId",requireSignin,postsByUser);


//authorization
//userById() will execute whenever we encounter a parameter called :userId
router.param("userId",userById)  
//postById() will execut when :postId is in URL 
router.param("postId",postById)  

router.delete('/post/:postId',requireSignin,isPoster,deletePost )

router.put("/post/:postId", requireSignin, isPoster, updatePost);

module.exports=router;
