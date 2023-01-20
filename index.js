const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const User=require('./models/user');
const Exercise=require('./models/exercise');

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("strictQuery",false);

const db = mongoose.connection;
db.on("error",console.error.bind(console,"MongoDB connection error"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users',(req,res)=>{
  const username=req.body.username;
  const user=new User({username:username});
  user.save((err,newUser)=>{
    if(err){
      res.json(err);
    }
    else{
      res.json(newUser);
    }
    
  });
});

app.get('/api/users',(req,res)=>{
  User.find({},(err,users)=>{
    if(err){
      res.json({error:err});
    }
    else{
      res.json(users);
    }
  })
});

app.post('/api/users/:_id/exercises',(req,res)=>{
  //TODO
});

app.get('/api/users/:_id/logs',(req,res)=>{
  // TODO
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
