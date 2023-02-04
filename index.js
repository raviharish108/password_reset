import express from "express"
import { connect } from "./connect.js";
import userrouter from "./routes/user.js";
import * as dotenv from "dotenv"
import cors from "cors"
dotenv.config();
const app=express();
app.use(express.json())
app.use(cors());
app.use("/api/user",userrouter);
app.get("/",(req,res)=>{
    res.send("hello world")
})

app.listen(3000,async()=>{
    try{
    await connect();
    await console.log("port is connected")
    }catch{
        console.log(err)
    }
})