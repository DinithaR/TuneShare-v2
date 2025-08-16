
import express from "express";
import { getInstruments, getUserData, loginUser, registerUser, becomeOwner, getAllUsers } from "../controllers/UserController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/instruments', getInstruments);
userRouter.post('/become-owner', protect, becomeOwner);
userRouter.get('/all', protect, isAdmin, getAllUsers);

export default userRouter;

