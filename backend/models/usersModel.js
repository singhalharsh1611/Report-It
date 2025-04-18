import mongoose from "mongoose";
 
 const userSchema = new mongoose.Schema({
     name:String, 
     email:{type:String, unique:true},
     password:String,
     role:{
         type:String,
         enum:['citizen', 'moderator', 'admin'],
         default:'citizen',
     },
 });
 
 export default mongoose.model('User', userSchema);