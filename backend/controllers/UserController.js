// Admin: Get all instruments
export const adminGetAllInstruments = async (req, res) => {
    try {
        const instruments = await Instrument.find();
        res.json({ success: true, instruments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin: Delete instrument
export const adminDeleteInstrument = async (req, res) => {
    try {
        const { instrumentId } = req.params;
        if (!instrumentId) return res.json({ success: false, message: 'Instrument ID required' });
        const instrument = await Instrument.findByIdAndDelete(instrumentId);
        if (!instrument) return res.json({ success: false, message: 'Instrument not found' });
        res.json({ success: true, message: 'Instrument deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin: Edit instrument
export const adminEditInstrument = async (req, res) => {
    try {
        const { instrumentId, ...update } = req.body;
        if (!instrumentId) return res.json({ success: false, message: 'Instrument ID required' });
        const instrument = await Instrument.findByIdAndUpdate(instrumentId, update, { new: true, runValidators: true });
        if (!instrument) return res.json({ success: false, message: 'Instrument not found' });
        res.json({ success: true, instrument });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin: Change user role
export const changeUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) return res.json({ success: false, message: 'User ID and role required' });
        if (!['user', 'owner', 'admin'].includes(role)) return res.json({ success: false, message: 'Invalid role' });
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true }).select('-password');
        if (!user) return res.json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.json({ success: false, message: 'User ID required' });
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin: Edit user details (name, email, image)
export const editUser = async (req, res) => {
    try {
        const { userId, name, email, image } = req.body;
        // Only allow editing self unless admin
        if (!userId) return res.json({ success: false, message: 'User ID required' });
        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorized' });
        }
        const update = {};
        if (name) update.name = name;
        if (email) update.email = email;
        if (image) update.image = image;
        const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select('-password');
        if (!user) return res.json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
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

