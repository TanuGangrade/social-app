import MainRouter from "./MainRouter"
import React,{Component} from 'react';
import {BrowserRouter} from 'react-router-dom'


const App = () => (
  <BrowserRouter>
      <MainRouter />
  </BrowserRouter>
);
export default App;
