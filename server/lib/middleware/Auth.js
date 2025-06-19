
//Middleware to protect routes from unauthorized access

import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const protectRoute=async (req,res,next)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.verify(token,process.env.SECRET_KEY)

        const user=await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});
        req.user=user;
        next();
    }catch(error){
        console.log(error.message)
        res.json({
            status:400,
            message:error.message
        })
    }
}
