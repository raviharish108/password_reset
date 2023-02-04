import User from "../model/user.js"
import  resetToken from "../model/restToken.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sentEmail } from "./sendEmail.js"
import { isValidObjectId } from "mongoose"
import { successEmail } from "./sendEmail.js"
function validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function generateToken() {
    return crypto.randomBytes(64).toString('hex');
  }
export const user_create= async(req,res)=>{
    try{
           const {name,email,password}= await req.body;
           if(!name||!email||!password){
                   return res.status(400).json({msg: "Please fill in all fields."})
           }
           if(!validateEmail(email)){
                   return res.status(400).json({msg: "Invalid emails."})
           }
           const user = await User.findOne({email})

           if(user){
           return res.status(400).json({msg: "This email already exists."})
           }   
           
           if(password.length < 6){
                   return res.status(400).json({msg: "Password must be at least 6 characters."})
            } 
            const passwordHash = await bcrypt.hash(password, 12) 
            
            const newuser={name,email,password:passwordHash}
            const newUser=new User(newuser)
             await newUser.save();
             res.status(200).send(newUser);
          } catch(err){
           return res.status(500).json({msg:err.message})
          }
}     

export const usersignin=async(req,res)=>{
    try{
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) return ((404, "User not found!"));
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect)return res.send("wrong credentioal").status(400)
        const token = jwt.sign({ id: user._id },"token",{expiresIn:"1d"});
         const { password, ...others } = user._doc;  
        res.json({
            success:true,
            user:{name:user.name,email:user.email,id:user._id,token:token}
        })
    } catch (err) {
    return res.status(500).json({msg:err.message})
  }

}

export const reset=async(req,res)=>{
    try{
     const{email}=req.body;
     if(!email){
      return res.status(400).json({msg:"please fill in the email address"})
     }
     const user=await User.findOne({email})
     if(!user) {
      return res.status(400).json({msg:"this email does not exist"})
     }
  
     const any_token_available=await resetToken.findOne({owner:user._id})
    if(any_token_available){
      return res.status(400).json({msg:"you can try after one hour!!"})
    }
    const token=await generateToken();
     const hashedtoken=await bcrypt.hash(token, 12) ;
     const temp={ "owner":user._id,  "token":hashedtoken};
     const newreset = new resetToken (temp);
     await newreset.save();
     const url=`http://localhost:3001/change-password?token=${token}&id=${user._id}`
     await sentEmail(user,url,"reset you password")
     res.json({
      success:true,
     message:"password link sent to email",
  })
    }catch(err){
      return res.status(500).json({msg:err.message})
    }
  }

  export const change_password=async(req,res)=>{
    try{
  const{token,id}=req.query
  if(!token||!id){
    return res.status(400).json({msg:"invalid request"})
  }
  if(!isValidObjectId(id)){
    return res.status(400).json({msg:"invalid id"})
  }
  const user=await User.findById(id)
if(!user){
  return res.status(400).json({msg:"user cannot found!"})
}
 const resettoken=await resetToken.findOne({owner:user._id})
 if(!resettoken){
  return res.status(400).json({msg:"reset token not found!!"})
 }
 const isCorrect = await bcrypt.compare(token, resettoken.token);
 if (!isCorrect){
  return res.status(400).json({msg:"wrong credentials"})
}

const {password}=req.body;
const issamepassword = await bcrypt.compare(password, user.password);
if(issamepassword){
  return res.status(400).json({msg:"dont give same password"})
}
if(password.length<8){
  return res.status(400).json({msg:"password must be atleast 8 to 12 characters"})
}
const passwordhash=await bcrypt.hash(password,12)
await User.findOneAndUpdate({_id:id},{password:passwordhash})
  await resetToken.findByIdAndDelete(resettoken._id);
  await successEmail(user,"successfully changed password")
res.status(500).json({msg:"password successfully changed"})
}catch(err){
  res.status(400).json({msg:err.message})
}
}

export const isValidToken=async(req,res)=>{
  try{
    const{token,id}=req.query;
    if(!token||!id){
      return res.status(400).json({msg:"invalid request"})
    }
    if(!isValidObjectId(id)){
      return res.status(400).json({msg:"invalid id"})
    }
  const user=await User.findById(id)
  if(!user){
    return res.status(400).json({msg:"user cannot found!"})
  }
   const resettoken=await resetToken.findOne({owner:user._id})
   if(!resettoken){
    return res.status(400).json({msg:"reset token not found!!"})
   }
   const isCorrect = await bcrypt.compare(token, resettoken.token);
   if (!isCorrect){
    return res.status(400).json({msg:"wrong credentials"})
  }  
  res.status(200).json({msg:"true"})
}catch(err){
  res.status(400).json({msg:err.message})
}
}
