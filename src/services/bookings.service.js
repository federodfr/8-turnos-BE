
import { BookingsRepository } from "../repositories/bookings.repository.js";

class BookingsService {
    constructor(repository = new BookingsRepository()) {
        this.repository = repository;
    }

    async getBookings() {
        try {
            const bookings = await this.repository.getAll();


            if (!bookings) {
                throw new Error("Reservas no encontradas");
            }

            return bookings;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getBookingByID(id) {
        try {
            const booking = await this.repository.getById(id);


            if (!booking) {
                throw new Error("Reserva no encontrada");
            }

            return booking;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async createBooking(data) {
        try {
            const { clientName, clientEmail, date, time, status } = data;
            if (!clientName || !clientEmail || !date || !time || !status ) {
                throw new Error("Todos los campos son requeridos");
            }

            const newBooking = await this.repository.create(data);

            return newBooking;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addServiceToBooking(bid, sid) {
        const newBooking = await this.repository.addServiceToBooking(bid, sid);

        return newBooking;
    }

    // async addServiceToBooking(params) {
    //     try {
    //         const {bid, sid} = params;

    //         const booking = await this.repository.getById(bid);

    //         if(!booking) {
    //             throw new Error("Reserva no encontrada")
    //         }

    //         const service = await serviceServices.getServicesById(sid);

    //         if(!service) {
    //             throw new Error("Servicio no encontrado")
    //         }

    //         let servicesList = booking.services.map(s => (s.toObject ? s.toObject() : s));

    //         const serviceIndex = servicesList.findIndex(s => s.service.toString() === sid.toString());

    //         if (serviceIndex !== -1) {
    //             servicesList[serviceIndex].quantity += 1;
    //         } else {
    //             servicesList.push({ service: sid, quantity: 1 });
    //         }

    //         const updateServiceToBooking =  await this.repository.update(bid, {services: servicesList});
    //         return updateServiceToBooking
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }

    // }

}

export default BookingsService;