import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export async function connect() {
    let uri = process.env.DB_URI

    if (process.env.TEST_RUN) {
        const mongod = new MongoMemoryServer()

        uri = await mongod.getUri(true)
    }

    if (!uri) {
        throw new Error('Missing DB_URI environment variable.')
    }

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

export default mongoose
