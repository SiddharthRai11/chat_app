
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

//Signup a new user
export const signup=async(req,res)=>{
    const {fullName,email,password,bio}=req.body;
    try{
        const user=await User.findOne({email});
        if(user) return res.json({msg:"User already exists"});
        
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        });
        const token=generateToken(newUser._id);
        res.json({success:true, userData:newUser,token,msg:"Account created successfully"});

         
    }catch(error){res.json({success:false, msg:"error.message"})}
}

//Login a user
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const userData=await User.findOne({email});
         const isPasswordCorrect= await bcrypt.compare(password,userData.password);
         if(!isPasswordCorrect) return res.json({success:false,msg:"Invalid password"});
         const token=generateToken(userData._id);
         res.json({success:true,userData,token,msg:"Logged in successfully"});

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}
//Controller to check if user is authenticated
export const checkAuth=async(req,res)=>{
    res.json({
        success:true,
        //get user from middleware we created
        user:req.user
    })
}
//Controller to Udate user profile details
export const updateProfile=async(req,res)=>{
    try{
        const {profilePic,fullName,bio}=req.body;
        //get user from middleware we created
        const userId=req.user._id;
        let updatedUser;
          if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{fullName,bio},{new:true});
          }
          else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{fullName,bio,profilePic:upload.secure_url},
                {new:true}
            );
          }
          res.json({success:true,msg:"Profile updated successfully",user:updatedUser});


    }catch (error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

 