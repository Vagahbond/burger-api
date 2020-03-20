import db from '../db'

enum OrderStatus {
    InProgress,
    Done,
}


export const schema = new db.Schema({
    status: { type: OrderStatus, required: true, default: OrderStatus.InProgress, },
    customer: {type: db.Schema.Types.ObjectId, ref: 'User', required: true},
    products: {type: db.Schema.Types.ObjectId, ref: 'Product', required: true},
    creation_date: { type: Date, required: true, },
    withdrawal_date: { type: Date, required: true, },
})

export const model = db.model('Order', schema)
