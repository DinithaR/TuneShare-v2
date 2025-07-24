import Booking from "../models/Booking.js";
import Instrument from "../models/Instrument.js";

// API to get owner bookings
export const getOwnerBookings = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const bookings = await Booking.find({ owner: _id })
            .populate('instrument')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const { bookingId, status } = req.body;

        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Valid status values
        const validStatuses = ['pending', 'confirmed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Check if booking belongs to this owner
        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        booking.status = status;
        await booking.save();

        res.json({ 
            success: true, 
            message: `Booking ${status} successfully`,
            booking 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to create booking (for your InstrumentDetails page)
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { instrument, pickupDate, returnDate } = req.body;

        // Get instrument details
        const instrumentData = await Instrument.findById(instrument);
        
        if (!instrumentData) {
            return res.json({ success: false, message: "Instrument not found" });
        }

        if (!instrumentData.isAvailable) {
            return res.json({ success: false, message: "Instrument not available" });
        }

        // Calculate price (days * pricePerDay)
        const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
        const price = days * instrumentData.pricePerDay;

        const booking = await Booking.create({
            instrument,
            user: _id,
            owner: instrumentData.owner,
            pickupDate,
            returnDate,
            price
        });

        res.json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;

        const bookings = await Booking.find({ user: _id })
            .populate('instrument')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};



// import Booking from "../models/Booking.js"
// import Instrument from "../models/Instrument.js";


// // Function to Check Availability of Instrument for a given Date
// const checkAvailability = async (instrument, pickupDate, returnDate) => {
//     const bookings = await Booking.find({
//         instrument,
//         pickupDate: {$lte : returnDate},
//         returnDateDate: {$lte : pickupDate},
//     })
//     return bookings.length === 0;
// }

// // API to Check Availability of Instrument for the given Date and Location
// export const checkAvailabilityOfInstrument = async (req, res) => {
//     try {
//         const {location, pickupDate, returnDate} = req.body
        
//         // fetch all available instruments for the given location
//         const instruments = await Instrument.find({location, isAvailable: true})

//         // check instrument availability for the given date range using promise
//         const availableInstrumentsPromises = instruments.map(async (instrument) => {
//             const isAvailable = await checkAvailability(instrument._id, pickupDate, returnDate)
//             return {...instrument._doc, isAvailable: isAvailable}
//         })

//         let availableInstruments = await Promise.all(availableInstrumentsPromises);
//         availableInstruments = availableInstruments.filter(instrument => instrument.isAvailable === true)

//         res.json({success: true, availableInstruments})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to Create Booking
// export const createBooking = async (req, res) => {
//     try {
//         const {_id} = req.user;
//         const {instrument, pickupDate, returnDate} = req.body;
        
//         const isAvailable = await checkAvailability(instrument, pickupDate, returnDate)
//         if(!isAvailable){
//             return res.json({success: false, message: "Instrument is not available"})
//         }

//         const instrumentData = await Instrument.findById(instrument)

//         // Calculate price based on pickupDate and returnDate
//         const picked = new Date(pickupDate);
//         const returned = new Date(returnDate);
//         const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
//         const price = instrumentData.pricePerDay * noOfDays;

//         await Booking.create({instrument, owner: instrumentData.owner, user:_id, pickupDate, returnDate, price})

//         res.json({success: true, message: "Booking Created"})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to List User Bookings
// export const getUserBookings = async (req, res) => {
//     try {
//          const {_id} = req.user;
//          const bookings = await Booking.find({ user: _id }).populate("instrument").sort({createdAt: -1})
//          res.json({success: true, bookings})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to get Owner Bookingd
// export const getOwnerBookings = async (req, res) => {
//     try {
//          if(req.user.role !== 'owner'){
//             return res.json({success: false, message: "Unauthorized"})
//          }
//          const bookings = await Booking.find({owner: req.user._id}).populate('instrument user').select("-user.password").sort({createdAt: -1})
//          res.json({success: true, bookings})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to change booking status
// export const changeBookingStatus = async (req, res) => {
//     try {
//         const {_id} = req.user;
//         const {bookingId, status} = req.body

//         const booking = await Booking.findById(bookingId)

//         if(booking.owner.toString() !== _id.toString()){
//             return res.json({success: false, message: "Unauthorized"})
//         }

//         booking.status = status;
//         await booking.save();

//         res.json({success: false, message: "Status Updated"})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }
