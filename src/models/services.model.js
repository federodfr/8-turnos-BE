import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    available: {
        type: Boolean,
        required: true,
        index: true
    },
})

ServiceSchema.plugin(paginate)

export const ServiceModel = mongoose.model("services", ServiceSchema)