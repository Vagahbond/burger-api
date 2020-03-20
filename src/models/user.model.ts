import db from '../db'

export enum UserLevel {
    Customer,
    Preparator,
    Admin,
}

export interface IUser extends db.Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    level: UserLevel;
}

export const schema = new db.Schema({
    firstname: { type: String, required: true, },
    lastname: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    level: { type: UserLevel, required: true, default: UserLevel.Customer, },
})

export const model = db.model<IUser>('User', schema)

export function sanitize_user(user: any) {
    if (!user) return null

    return {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        level: user.level,
    }
}
