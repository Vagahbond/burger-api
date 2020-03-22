import db from '../db'

export interface IProduct {
    name: string
    count: number
    price: number
    promotion: number
}

export const schema = new db.Schema({
    name: { type: String, required: true, },
    count: { type: Number, required: true, },
    price: { type: Number, required: true, },
    promotion: { type: Number, required: true, },
})

export const model = db.model<IProduct & db.Document>('Product', schema)

export function sanitize_product(product: any) {
    if (!product) return null

    return {
        id: product._id,
        name: product.name,
        count: product.count,
        price: product.price,
        promotion: product.promotion,
    }
}
