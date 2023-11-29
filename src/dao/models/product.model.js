import mongoose from 'mongoose'

mongoose.pluralize(null)

const collection = 'products'

const schema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code : {type: Number, required: true},
    price: {type: Number, required: true},
    status: {type: Boolean, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    thumbnail: {type: String, required: true},
})

export default mongoose.model(collection, schema)