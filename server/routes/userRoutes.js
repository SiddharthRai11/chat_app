import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import { protectRoute } from '../lib/middleware/Auth.js';


const userRouter=express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.put('/upadate-profile',protectRoute,updateProfile);
userRouter.get('/check',protectRoute,checkAuth);

export default userRouter;