const {getPosts,photo,createPost, postsByUser, 
    postById ,isPoster,deletePost, updatePost
    ,singlePost,like,unlike,comment,uncomment }=require('../controllers/posts')
const express=require('express')
const router=express.Router();
const {createPostValidator}=require('../validator/index')
const {requireSignin}=require('../controllers/auth')
const {userById}=require('../controllers/user');

router.put('/post/like',requireSignin,like)
router.put('/post/unlike',requireSignin,unlike)

router.put('/post/comment',requireSignin,comment)
router.put('/post/uncomment',requireSignin,uncomment)
//authorization
//userById() will execute whenever we encounter a parameter called :userId
router.param("userId",userById)  
//postById() will execut when :postId is in URL 
router.param("postId",postById)  
router.get('/posts',getPosts)
router.post('/post/new/:userId',requireSignin,createPost,createPostValidator)
router.get("/posts/by/:userId",requireSignin,postsByUser);
router.delete('/post/:postId',requireSignin,isPoster,deletePost )
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.get("/post/photo/:postId",photo)
router.get('/post/:postId',singlePost)




module.exports=router;
