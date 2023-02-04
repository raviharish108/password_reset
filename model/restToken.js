import mongoose from "mongoose";

  export const resetSchema= new mongoose.Schema({
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
   },
   token:{
    type:String,
    require:true
   },
   createdAt:{
    type:Date,
    expires:3600,
    default:Date.now()
   }
})
export default mongoose.model("resetToken", resetSchema);