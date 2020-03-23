import { Request, Response, NextFunction } from 'express'

import * as models from '../models'

interface GuardOptions {
    auth?: boolean
    allow?: models.user.UserLevel[]
    deny?: models.user.UserLevel[]
}

export default (options: GuardOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (options.auth === true) {
            if ((typeof req.user?.level !== 'number') || options.deny?.includes(req.user.level)) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized.',
                })
            }
        } else if (options.auth === undefined) {
            if ((typeof req.user?.level !== 'number') || !options.allow?.includes(req.user.level)) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized.',
                })
            }
        } else if (options.auth === false && req.user) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden.',
            })
        }

        next()
    }
}
