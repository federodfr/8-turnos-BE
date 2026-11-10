import { Router } from "express";
import {validateBody} from "../middlewares/validate.js"
import {
  getBookingByID,
  createBooking,
  addServiceToBooking
} from "../controllers/bookings.controller.js"
import {createBookingSchema} from "../validations/booking.validation.js"


const router = Router();

router.get("/:bid", getBookingByID);

router.post("/", validateBody(createBookingSchema),createBooking);

router.post("/:bid/services/:sid", addServiceToBooking);

export default router;
