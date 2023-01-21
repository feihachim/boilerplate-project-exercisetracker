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
  
  const userId=req.params._id;
  const description=req.body.description;
  const duration=Number(req.body.duration);
  const date=req.body.date?new Date(req.body.date):new Date();
  User.findOne({_id:userId},(error,user)=>{
    if(error){
      return handleError(error);
    }
    const exercise=new Exercise({
      description:description,
      duration:duration,
      date:date.toDateString(),
      userId:userId,
      username:user.username
    });
    exercise.save((err,insertedExercise)=>{
      if(err){
        return handleError(err);
      }
      const result={
        _id:insertedExercise.userId,
        username:insertedExercise.username,
        description:insertedExercise.description,
        duration:insertedExercise.duration,
        date:insertedExercise.date
      }
      res.json(result);
    });
  });
});

app.get('/api/users/:_id/logs',(req,res)=>{
  // TODO
  const userId=req.params._id;
  Exercise.find({userId:userId},(error,exercises)=>{
    if(error){
      return handleError(error);
    }
    const username=exercises[0].username;
    const exrecisesCount=exercises.length;
    const exercisesList=exercises.map((item)=>{
      return {
        description:item.description,
        duration:item.duration,
        date:item.date
      }
    });
    res.json({
      username:username,
      count:exrecisesCount,
      _id:userId,
      log:exercisesList
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
