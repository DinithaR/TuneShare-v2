import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Instrument from "../models/Instrument.js";
import User from "../models/User.js";
import fs from "fs";

// API to change Role as User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list instruments"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Instrument
export const addInstrument = async (req, res) => {
    try {
        const {_id} = req.user;
        let instrument = JSON.parse(req.body.instrumentData);
        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/instruments'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                {format: 'webp'} // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Instrument.create({...instrument, owner: _id, image})

        res.json({success: true, message: "Instrument Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Owner Instruments
export const getOwnerInstruments = async (req, res) => {
    try {
        const {_id} = req.user;
        const instruments = await Instrument.find({owner: _id})
        res.json({success: true, instruments})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle instrument Availability
export const toggleInstrumentAvailability = async (req, res) => {
    try {
        const {_id} = req.user;
        const {instrumentId} = req.body
        const instrument = await Instrument.findById(instrumentId)

        // Checking is car belongs to the user
        if(instrument.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        instrument.isAvailable = !instrument.isAvailable;
        await instrument.save()

        res.json({success: true, message: "Availability Toggled", instrument})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// // API to Toggle instrument Availability
// export const toggleInstrumentAvailability = async (req, res) => {
//     try {
//         const { _id } = req.user;
//         const { instrumentId } = req.body;
//         const instrument = await Instrument.findById(instrumentId);

//         if (!instrument) {
//             return res.json({ success: false, message: "Instrument not found" });
//         }
//         if (!instrument.owner) {
//             return res.json({ success: false, message: "Instrument has no owner" });
//         }
//         if (instrument.owner.toString() !== _id.toString()) {
//             return res.json({ success: false, message: "Unauthorized" });
//         }

//         instrument.isAvailable = !instrument.isAvailable;
//         await instrument.save();

//         res.json({ success: true, message: "Availability Toggled", instrument });
//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message });
//     }
// }

// API to delete a instrument
export const deleteInstrument = async (req, res) => {
    try {
        const {_id} = req.user;
        const {instrumentId} = req.body
        const instrument = await Instrument.findById(instrumentId)

        // Checking is car belongs to the user
        if(instrument.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        instrument.owner = null;
        instrument.isAvailable = false;

        await instrument.save()

        res.json({success: true, message: "Instrument Removed", instrument})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const {_id, role} = req.user;

        if(role !== 'owner'){
            return res.json({success: false, message: "Unauthorized"})
        }

        const instruments = await Instrument.find({owner: _id})
        const bookings = await Booking.find({owner: _id}).populate('instrument').sort({createdAt: -1});

        const pendingBookings = await Booking.find({owner: _id, status: "pending"})
        const completedBookings = await Booking.find({owner: _id, status: "confirmed"})

        // Calculate monthlyRevenue froom bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(bookings => bookings.status === 'confirmed').reduce((acc, booking) => acc + booking.price, 0)

        const dashboardData = {
            totalInstruments: instruments.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({success: true, dashboardData});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image
export const updateUserImage = async (req,res) => {
    try {
        const {_id} = req.user;
        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                {format: 'webp'} // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Upadated"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}