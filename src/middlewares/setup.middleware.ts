import { Request, Response, NextFunction } from 'express'

import * as models from '../models'

export default (req: Request, res: Response, next: NextFunction) => {
    if (!models.config.is_setup && req.url !== '/setup') {
        return res.status(401).send({
            success: false,
            error: 'Setup needed.',
        })
    }

    next()
}
