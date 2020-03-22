import { Router } from 'express'
const router = Router()
export default router

import Joi from '@hapi/joi'

import * as models from '../models'
import * as security from '../utils/security.utils'

interface ISetupPost {
    firstname: string
    lastname: string
    email: string
    password: string
}

const setup_post_schema = Joi.object<ISetupPost>().options({
    abortEarly: false,
    stripUnknown: true,
}).keys({
    firstname: Joi.string().pattern(/^[\p{L}\- ]{2,}$/u).required().messages({
        'string.base': `'firstname' should be a string`,
        'string.empty': `'firstname' cannot be empty`,
        'string.pattern': `'firstname' is invalid`,
        'any.required': `'firstname' is a required field`
    }),
    lastname: Joi.string().pattern(/^[\p{L}\- ]{2,}$/u).required().messages({
        'string.base': `'lastname' should be a string`,
        'string.empty': `'lastname' cannot be empty`,
        'string.pattern': `'lastname' is invalid`,
        'any.required': `'lastname' is a required field`
    }),
    email: Joi.string().email().required().messages({
        'string.base': `'email' should be a string`,
        'string.empty': `'email' cannot be empty`,
        'string.email': `'email' is an invalid email address`,
        'any.required': `'email' is a required field`
    }),
    password: Joi.string().min(5).required().messages({
        'string.base': `'password' should be a string`,
        'string.empty': `'password' cannot be empty`,
        'string.min': `'password' should have a minimum length of {#limit}`,
        'any.required': `'password' is a required field`
    }),
})

router.post('/setup', async (req, res, next) => {
    try {
        if (models.config.is_setup) {
            return next()
        }

        const data: ISetupPost = await setup_post_schema.validateAsync(req.body)

        const user = await models.user.model.create({
            firstname: data.firstname.trim().replace(/  +/g, ''),
            lastname: data.lastname.trim().replace(/  +/g, ''),
            email: data.email,
            password: await security.hash(data.password),
            level: models.user.UserLevel.Admin,
        })

        await models.config.model.updateOne({ name: 'setup' }, { value: 'done' }, { upsert: true })
        models.config.is_setup = true

        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (e) {
        if ('details' in e) {
            return res.status(400).json({
                success: false,
                errors: (e as Joi.ValidationError).details.map(d => d.message),
            })
        }

        res.status(500).json({
            success: false,
            error: "Failed to setup."
        })
    }
})
