import db from '../db'

import { IUser } from './user.model'
import { IProduct } from './product.model'
import { IMenu } from './menu.model'

enum OrderStatus {
    InProgress,
    Done,
    Cancelled
}

export interface IOrder {
    _id: db.Schema.Types.ObjectId
    status: OrderStatus
    customer: db.Schema.Types.ObjectId | IUser
    products: (db.Schema.Types.ObjectId | IProduct)[]
    menus: (db.Schema.Types.ObjectId | IMenu)[]
    creation_date: Date
    withdrawal_date: Date
}

export const schema = new db.Schema({
    status: { type: OrderStatus, required: true, default: OrderStatus.InProgress, },
    customer: { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: db.Schema.Types.ObjectId, ref: 'Product', required: true }],
    menus: [{ type: db.Schema.Types.ObjectId, ref: 'Menu', required: true }],
    creation_date: { type: Date, required: true, default: Date.now() },
    withdrawal_date: { type: Date, required: true, },
})

export const model = db.model<IOrder & db.Document>('Order', schema)
