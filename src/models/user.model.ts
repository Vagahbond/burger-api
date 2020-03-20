import db from '../db'

enum UserLevel {
    Customer,
    Preparator,
    Admin,
}

export const schema = new db.Schema({
    firstname: { type: String, required: true, },
    lastname: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    level: { type: UserLevel, required: true, default: UserLevel.Customer, },
})

export const model = db.model('User', schema)
