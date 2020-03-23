import { Request, Response, NextFunction } from 'express'
import Joi from '@hapi/joi'

interface SchemasOptions {
    body?: Joi.ObjectSchema<any>
    query?: Joi.ObjectSchema<any>
}

const schema_options = {
    abortEarly: false,
    stripUnknown: true,
}

export default (options: SchemasOptions) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (options.body) {
            req.body = await options.body.options(schema_options).validateAsync(req.body)
        }

        if (options.query) {
            req.query = await options.query.options(schema_options).validateAsync(req.query)
        }

        next()
    } catch (e) {
        if ('details' in e) {
            return res.status(400).json({
                success: false,
                errors: (e as Joi.ValidationError).details.map(d => d.message),
            })
        }

        res.status(500).json({
            success: false,
            error: "An error occured while validating the request."
        })
    }
}
