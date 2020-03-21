import { Request, Response, NextFunction } from 'express'

import * as models from '../models'

export default async (req: Request, res: Response, next: NextFunction) => {
    if (req.token) {
        try {
            const token = await models.token.model.findOne({ token: req.token }).populate('user').lean()
            req.user = token?.user as models.user.IUser
        } catch { }
    }

    next()
}
