import { BookingsDAO } from "../dao/bookings.dao.js"
import { ServicesDAO } from "../dao/services.dao.js"

export class BookingsRepository {

    constructor(bookingDao = new BookingsDAO(), serviceDao = new ServicesDAO()) {
        this.bookingDao = bookingDao;
        this.serviceDao = serviceDao;

    }

    async getAll() {
        return await this.bookingDao.getAll()
    }

    async getById(id) {
        return await this.bookingDao.getById(id)
    }

    async create(data) {
        return await this.bookingDao.create(data)
    }

    async addServiceToBooking(bid, sid) {
        const requiredBooking = await this.bookingDao.getById(bid)
        if (!requiredBooking) throw new Error('Reserva no encontrada')
        const requiredServide = await this.serviceDao.getById(sid)
        if (!requiredServide) throw new Error('Servicio no encontrado')

        const serviceIndex = requiredBooking.services.findIndex(s => s.service?._id.toString() === sid.toString());
        console.log(requiredBooking.services[0].service)
        console.log(requiredBooking.services)
        console.log(serviceIndex)

        if (serviceIndex !== -1) {
            requiredBooking.services[serviceIndex].quantity += 1;
        } else {
            requiredBooking.services.push({ service: sid, quantity: 1 });
        }

        const booking = await this.bookingDao.addServiceToBooking(bid, requiredBooking);

        return booking
    }

}