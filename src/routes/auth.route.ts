import { Router } from 'express'
const router = Router()
export default router

import crypto from 'crypto'
import Joi from '@hapi/joi'

import * as models from '../models'
import * as security from '../utils/security.utils'

import guard from '../middlewares/guard.middleware'
import schema from '../middlewares/schema.middleware'

interface IAuthRegisterPost {
    firstname: string
    lastname: string
    email: string
    password: string
}

const auth_register_post_schema = Joi.object<IAuthRegisterPost>().keys({
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

router.post('/auth/register', guard({ auth: false }), schema({ body: auth_register_post_schema }), async (req, res) => {
    try {
        const data = req.body as IAuthRegisterPost

        const user = await models.user.model.create({
            firstname: data.firstname.trim().replace(/  +/g, ''),
            lastname: data.lastname.trim().replace(/  +/g, ''),
            email: data.email,
            password: await security.hash(data.password),
        })

        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Failed to register."
        })
    }
})

interface IAuthLoginPost {
    email: string
    password: string
}

const auth_login_post_schema = Joi.object<IAuthLoginPost>().options({
    abortEarly: false,
    stripUnknown: true,
}).keys({
    email: Joi.string().email().required().messages({
        'string.base': `'email' should be a string`,
        'string.empty': `'email' cannot be empty`,
        'string.email': `'email' is an invalid email address`,
        'any.required': `'email' is a required field`
    }),
    password: Joi.string().min(5).required().messages({
        'string.base': `'password' should be a string`,
        'string.empty': `'password' cannot be empty`,
        'any.required': `'password' is a required field`
    }),
})

router.post('/auth/login', guard({ auth: false }), schema({ body: auth_login_post_schema }), async (req, res) => {
    try {
        const data = req.body as IAuthLoginPost

        const invalid_credentials = () => res.status(400).json({
            success: false,
            error: "Invalid credentials."
        })

        const user = await models.user.model.findOne({ email: data.email }).lean()

        if (!user)
            return invalid_credentials()

        const valid = await security.compare_hash(user.password, data.password)
        if (!valid)
            return invalid_credentials()

        const token = await models.token.model.create({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id,
        })

        res.json({
            success: true,
            token: token.token,
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Failed to login."
        })
    }
})
