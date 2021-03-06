import React from 'react'
import {Route,Switch} from 'react-router-dom';
import Home from './core/Home'
import Signup from './user/Signup';
import Signin from './user/signin'
import Menu from './core/Menu'
import Profile from './user/profile'
import Users from './user/users'
import editProfile from './user/editProfile'
import findPeople from './user/FindPeople'
import NewPost from './post/NewPost'
import PrivateRoute from './auth/PrivateRoute'
import singlePost from './post/singlePost'
import editPost from './post/editPost';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter=()=>(
    <div>
    <Menu/>
    <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/users' component={Users}></Route>
            <Route exact path='/signup' component={Signup}></Route>
            <Route exact path='/signin' component={Signin}></Route>
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword}/>
<PrivateRoute exact path='/post/edit/:postId' component={editPost}></PrivateRoute>
            <PrivateRoute exact path='/user/:userId' component={Profile}></PrivateRoute>
            <PrivateRoute exact path='/user/edit/:userId' component={editProfile}></PrivateRoute>
            <PrivateRoute exact path='/findpeople' component={findPeople}></PrivateRoute>
            <PrivateRoute exact path='/post/create' component={NewPost}></PrivateRoute>
            <Route exact path='/post/:postId' component={singlePost}></Route>
            <PrivateRoute exact path='/post/create' component={NewPost}></PrivateRoute>

    </Switch>
    </div>
)

export default MainRouter;