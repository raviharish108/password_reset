import express from "express"
import { user_create,usersignin,reset,change_password,isValidToken } from "../controller/usercontrol.js";

const router=express.Router();

router.post("/signup", user_create);
router.post("/signin", usersignin);
router.post("/reset",reset);
router.post("/change",change_password);
router.get("/valid",isValidToken);
export default router;