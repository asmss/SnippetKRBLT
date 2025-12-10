const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
       user:{type:mongoose.Schema.Types.ObjectId,required:true, ref:"User"},
      title:{type:String,required:true},
      code:{type:String,required:true},
        createdAt:{type:Date,default:Date.now}
},{timestamps:true}
);

module.exports = mongoose.model("Snippet",snippetSchema);