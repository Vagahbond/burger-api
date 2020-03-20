import mongoose from 'mongoose'

export function connect() {
    return mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

export default mongoose
