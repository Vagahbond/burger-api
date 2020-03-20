import { Request, Response, NextFunction } from 'express'

import * as models from '../models'

interface GuardOptions {
    auth?: false
    allow?: models.user.UserLevel[]
}

export default (options: GuardOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (options.auth === undefined) {
            if (!req.user?.level || !options.allow?.includes(req.user.level)) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized.',
                })
            }
        } else if (options.auth === false && req.user) {
            return res.status(404).json({
                success: false,
                error: 'Forbidden.',
            })
        }

        next()
    }
}
