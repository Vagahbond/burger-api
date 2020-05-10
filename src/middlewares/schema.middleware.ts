import { Request, Response, NextFunction } from 'express'
import Joi from '@hapi/joi'

export interface SchemasOptions {
    params?: Joi.ObjectSchema<any>
    body?: Joi.ObjectSchema<any>
    query?: Joi.ObjectSchema<any>
}

export class SchemaError extends Error { }

const schema_options = {
    abortEarly: false,
    stripUnknown: true,
}

export default (options: SchemasOptions) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (options.params) {
            req.params = await options.params.options(schema_options).validateAsync(req.params)
        }

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
            error: (e instanceof SchemaError) ? e.message : 'An error occured while validating the request.',
        })
    }
}
