import { Request, Response, NextFunction } from 'express'

import * as models from '../models'

export default async (req: Request, res: Response, next: NextFunction) => {
    if (req.token) {
        try {
            req.user = await models.token.model.findOne({ token: req.token }).populate('user').lean() as models.user.IUser
        } catch { }
    }

    next()
}
