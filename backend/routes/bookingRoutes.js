import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  createBooking, 
  getOwnerBookings, 
  changeBookingStatus,
  getUserBookings 
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// User routes
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);

// Owner routes  
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;



// import express from "express";
// import { changeBookingStatus, checkAvailabilityOfInstrument, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
// import { protect } from "../middleware/auth.js";

// const bookingRouter = express.Router();

// bookingRouter.post('/check-availablity', checkAvailabilityOfInstrument)
// bookingRouter.post('/create', protect, createBooking)
// bookingRouter.get('/user', protect, getUserBookings)
// bookingRouter.get('/owner', protect, getOwnerBookings)
// bookingRouter.post('/change-status', protect, changeBookingStatus)

// export default bookingRouter;