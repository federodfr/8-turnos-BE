import mongoose from 'mongoose'

const BookingSchema = mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: ["active", "inactive"]
    },
    services: {
        type: [{
            service: {
                type: mongoose.Types.ObjectId,
                ref: "services",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }],
        default: [],
        required: true
    },
})

export const BookingModel = mongoose.model('booking', BookingSchema)