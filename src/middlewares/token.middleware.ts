import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
    req.token = req.headers?.authorization || req.cookies?.token || req.body?.token || req.query?.token

    next()
}
