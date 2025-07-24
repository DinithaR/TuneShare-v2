import express from "express";
import { getInstruments, getUserData, loginUser, registerUser } from "../controllers/UserController.js";
import { protect } from "../middleware/auth.js"


const userRouter = express.Router();


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/instruments', getInstruments)



export default userRouter;


// import express from "express";
// import { getInstruments, getUserData, loginUser, registerUser } from "../controllers/UserController.js";
// import { protect } from "../middleware/auth.js"

// const userRouter = express.Router();

// userRouter.post('/register', registerUser)
// userRouter.post('/login', loginUser)
// userRouter.get('/data', protect, getUserData)
// userRouter.get('/instruments', getInstruments)


// export default userRouter;