import React from 'react'
import {Route,Switch} from 'react-router-dom';
import Home from './core/Home'
import Signup from './user/Signup';
import Signin from './user/signin'
import Menu from './core/Menu'
import Profile from './user/profile'
import Users from './user/users'
import editProfile from './user/editProfile'
import PrivateRoute from './auth/PrivateRoute'


const MainRouter=()=>(
    <div>
    <Menu/>
    <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/users' component={Users}></Route>
            <Route exact path='/signup' component={Signup}></Route>
            <Route exact path='/signin' component={Signin}></Route>
            <PrivateRoute exact path='/user/:userId' component={Profile}></PrivateRoute>
            <PrivateRoute exact path='/user/edit/:userId' component={editProfile}></PrivateRoute>
   
    </Switch>
    </div>
)

export default MainRouter;