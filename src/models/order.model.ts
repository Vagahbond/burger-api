import db from '../db'

import { IUser } from './user.model'
import { schema as ProductSchema, IProduct } from './product.model'
import { schema as MenuSchema, IMenu } from './menu.model'

export enum OrderStatus {
    InProgress,
    Done,
    Cancelled
}

export interface IOrder {
    _id?: db.Schema.Types.ObjectId
    status: OrderStatus
    customer?: db.Schema.Types.ObjectId | IUser
    products: IProduct[]
    menus: IMenu[]
    creation_date?: Date
    withdrawal_date?: Date
}

export const OrderProductSchema = new db.Schema({
    name: { type: String, required: true, },
    price: { type: Number, required: true, },
    promotion: { type: Number, required: true, },
    featured: { type: Boolean, required: true, default: false },
})

export const OrderMenuSchema = new db.Schema({
    name: { type: String, required: true, },
    products: [{ type: OrderProductSchema, required: true }],
    price: { type: Number, required: true, },
    promotion: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, required: true, default: false },
})

export const schema = new db.Schema({
    status: { type: OrderStatus, required: true, default: OrderStatus.InProgress, },
    customer: { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: OrderProductSchema }],
    menus: [{ type: OrderMenuSchema }],
    creation_date: { type: Date, required: true, default: Date.now() },
    withdrawal_date: { type: Date, },
})

export const model = db.model<IOrder & db.Document>('Order', schema)
