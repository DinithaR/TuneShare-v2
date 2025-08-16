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

// Update a user's booking
export const updateUserBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const { pickupDate, returnDate } = req.body;

    const booking = await Booking.findOne({ _id: id, user: _id });
    if (!booking) return res.json({ success: false, message: "Booking not found" });

    booking.pickupDate = pickupDate || booking.pickupDate;
    booking.returnDate = returnDate || booking.returnDate;
    await booking.save();

    res.json({ success: true, message: "Booking updated", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a user's booking
export const deleteUserBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;

    const booking = await Booking.findOneAndDelete({ _id: id, user: _id });
    if (!booking) return res.json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

