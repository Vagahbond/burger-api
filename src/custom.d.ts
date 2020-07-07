import * as models from './models'

declare global {
    namespace Express {
        export interface Request {
            token?: string
            user?: models.user.IUser
        }
    }
}
