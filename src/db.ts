import mongoose from 'mongoose'

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

export default mongoose
