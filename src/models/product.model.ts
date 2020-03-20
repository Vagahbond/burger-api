import db from '../db'

export const schema = new db.Schema({
    name: { type: String, required: true, },
    count: { type: Number, required: true, },
    price: { type: Number, required: true, },
    promotion: { type: Number, required: true, },
})

export const model = db.model('Product', schema)
