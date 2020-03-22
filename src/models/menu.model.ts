import db from '../db'

import { IProduct } from './product.model'

interface IMenu {
    name: string,
    products: (db.Schema.Types.ObjectId | IProduct)[]
    price: number
    promotion: number
}

export const schema = new db.Schema({
    name: { type: String, required: true, },
    products: [{ type: db.Schema.Types.ObjectId, ref: 'Product', required: true }],
    price: { type: Number, required: true, },
    promotion: { type: Number, required: true, default: 0 },
})

export const model = db.model<IMenu & db.Document>('Menu', schema)
