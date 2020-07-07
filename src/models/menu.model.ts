import db from '../db'

import { IProduct } from './product.model'
import { product } from '../models'

export interface IMenu {
    _id?: db.Schema.Types.ObjectId
    name: string,
    products: (db.Schema.Types.ObjectId | IProduct)[]
    price: number
    promotion: number
    featured?: boolean
}

export const schema = new db.Schema({
    name: { type: String, required: true },
    products: [{ type: db.Schema.Types.ObjectId, ref: 'Product', required: true }],
    price: { type: Number, required: true },
    promotion: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, required: true, default: false },
})

export const model = db.model<IMenu & db.Document>('Menu', schema)

export function sanitize_menu(menu: any) {
    if (!menu) return null

    return {
        id: menu._id,
        name: menu.name,
        products: menu.products.map(product.sanitize_product),
        price: menu.price,
        promotion: menu.promotion,
        featured: menu.featured,
    }
}
