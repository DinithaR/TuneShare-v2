// Get all instruments
export const getInstruments = async (req, res) => {
    try {
        const instruments = await Instrument.find();
        res.json({ success: true, instruments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Instrument from "../models/Instrument.js"

// Generate JWT Token
const generateToken = (userId)=> {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})

        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token, role: user.role})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// User Login
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials"})
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token, role: user.role})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Get user data using Token (JWT)
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Promote user to owner
export const becomeOwner = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { role: 'owner' }, { new: true });
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

