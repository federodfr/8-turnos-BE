
import { BookingModel } from "../models/bookings.model.js";


export class BookingsDAO {

    async getAll() {
        const bookings = await BookingModel.find().populate("services.service").lean();
        return bookings
    }

    async getById(id) {
        const booking = await BookingModel.findById(id).populate("services.service").lean();
        return booking
    }

    async create(data) {
        const newBooking = await BookingModel.create(data);
        return newBooking;
    }

    async addServiceToBooking(bid, data) {
        const updatedBooking = await BookingModel.findByIdAndUpdate(bid, data, { new: true });
        return updatedBooking

    }

    /*async update(id, data) {
        const updatedBooking = await BookingModel.findByIdAndUpdate(id, data, { new: true });
        return updatedBooking
    }*/
}
