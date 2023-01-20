const mongoose = require('mongoose');
mongoose.set("strictQuery",false);

const exerciseSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);