import db from '../db'

export interface IConfig {
    name: string
    value: string
}

export const schema = new db.Schema({
    name: { type: String, required: true, },
    value: { type: String, required: true, },
})

export const model = db.model<IConfig & db.Document>('Config', schema)

export let is_setup = false

export async function update_setup_check() {
    const config = await model.findOne({ name: 'setup' }).lean()

    return is_setup = (config?.value === 'done')
}
