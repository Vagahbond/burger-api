import db from '../db'

import { IUser } from './user.model'

export interface IToken {
    _id: db.Schema.Types.ObjectId
    token: string
    user: db.Schema.Types.ObjectId | IUser
}

export const schema = new db.Schema({
    token: { type: String, required: true },
    user: { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
})

export const model = db.model<IToken & db.Document>('Token', schema)
