import db from '../db'

export const schema = new db.Schema({
    name: { type: String, required: true, },
    products: [{type: db.Schema.Types.ObjectId, ref: 'Product', required: true}],
    price: { type: Number, required: true, },
    promotion: { type: Number, required: true, default: 0 },
})

export const model = db.model('Menu', schema)
