const express=require("express");
const morgan=require("morgan");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')
const expressValidator=require("express-validator")
let uuidv1 = require('uuidv1')
const fs=require("fs")
 const cors=require('cors')

const app=express();

app.use(cors())

app.use(express.urlencoded({ extended: true }));//bodyparser
app.use(express.json());

app.use(cookieParser())
app.use(expressValidator())
app.use(express.static("public"));

// load env variables
const dotenv = require('dotenv');
dotenv.config()
 
//db connection
mongoose.connect(
  process.env.MONGO_URI,
  {useCreateIndex:true, useUnifiedTopology: true,useNewUrlParser: true }
)
.then(() => console.log('DB Connected'))
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("493151 864 1491");
})
//-----------------------------------------------------------
const postsRoutes=require('./routes/posts')
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
app.use('/',postsRoutes)
app.use('/',authRoutes)
app.use("/",userRoutes)


app.get("/", (req, res) => {
  fs.readFile("apiDocs.json", (err, data) => {
      if (err) {
          res.status(400).json({
              error: err
          });
      }
      const docs = JSON.parse(data);
      res.json(docs);
  });
});



//for error during unautherised 
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('ur not alowud here');
  }
});