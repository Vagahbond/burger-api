import db from '../db'

export interface IToken extends db.Document {
    token: string;
    user: db.Schema.Types.ObjectId;
}

export const schema = new db.Schema({
    token: { type: String, required: true, },
    user: { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
})

export const model = db.model<IToken>('Token', schema)
