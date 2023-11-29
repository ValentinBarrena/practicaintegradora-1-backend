import mongoose from 'mongoose'

mongoose.pluralize(null)

const collection = 'messages'

const schema = new mongoose.Schema({
    messages: [String],
});

export default mongoose.model(collection, schema)