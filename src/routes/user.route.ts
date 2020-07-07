import { Router } from 'express'

import Joi from '@hapi/joi'
import { model } from 'mongoose'
import * as models from '../models'

import guard from '../middlewares/guard.middleware'
import schema from '../middlewares/schema.middleware'

import { UserLevel } from '../models/user.model'

const router = Router()

export default router

const levels: {[key:string]: models.user.UserLevel} = {
    admin: models.user.UserLevel.Admin,
    preparator: models.user.UserLevel.Preparator,
    customer: models.user.UserLevel.Customer,
}

// interface defining user fields
interface IUserSelfPut {
    firstname?: string
    lastname?: string
    password?: string
}

// interface defining user fields
interface IUserLevelPut {
    level: string
}

const user_level_put_schema = Joi.object<IUserLevelPut>().options({

    abortEarly: false,
    stripUnknown: true,
})
    .keys({
        level: Joi.string().valid('admin', 'customer', 'preparator').required().messages({
            'string.base': '\'level\' should be a string',
            'string.empty': '\'level\' cannot be empty',
            'any.valid': '\'level\' can only be either \'admin\', \'user\', or \'customer',
            'any.required': '\'level\' is a required field.',
        }),
    })

const user_attrs_put_schema = Joi.object<IUserSelfPut>().options({

    abortEarly: false,
    stripUnknown: true,
})
    .keys({
        firstname: Joi.string().pattern(/^[\p{L}\- ]{2,}$/u).messages({
            'string.base': '\'firstname\' should be a string',
            'string.empty': '\'firstname\' cannot be empty',
            'string.pattern': '\'firstname\' is invalid',
        }),
        lastname: Joi.string().pattern(/^[\p{L}\- ]{2,}$/u).messages({
            'string.base': '\'lastname\' should be a string',
            'string.empty': '\'lastname\' cannot be empty',
            'string.pattern': '\'lastname\' is invalid',
        }),
        password: Joi.string().min(5).messages({
            'string.base': '\'password\' should be a string',
            'string.empty': '\'password\' cannot be empty',
            'string.min': '\'password\' should have a minimum length of {#limit}',
        }),
    })

router.get('/users', async (req, res) => {
    try {
        const users = await models.user.model.find()

        res.json({
            success: true,
            users: users.map((user) => models.user.sanitize_user(user)),
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Could not query users.',
        })
    }
})

router.get('/users/:level', async (req, res) => {
    const level : string = req.params.level.toLowerCase();

    try {
        const level : string = req.params.level.toLowerCase();
        const user_level = levels[level.toLowerCase()]

        if (level in levels) {
            res.status(400).json({
                success: false,
                error: 'Provided authentification level is invalid.',
            })
        }

        const users = await models.user.model.find({ level: user_level })

        res.json({
            success: true,
            preparators: users.map((prep) => models.user.sanitize_user(prep)),
        })
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            error: `Could not query users with level ${level}.`,
        })
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await models.user.model.findById(id);

        if (user === undefined) {
            res.status(404).json({
                success: false,
                error: `User with ID ${id} does not exist.`,
            })
        }

        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Could not query user.',
        })
    }
})

router.get('/user/email/:email', async (req, res) => {
    try {
        const email = req.params.mail
        const user = await models.user.model.find({ mail: email });

        if (user === undefined) {
            res.status(404).json({
                success: false,
                error: `User with email ${email} does not exist.`,
            })
        }

        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Could not query user.',
        })
    }
})

// a user can change neither his mail adress nor his rights levels
router.put('/user', guard({ auth: true }), schema({ body: user_attrs_put_schema }), async (req, res) => {
    try {
        const id = req.user?._id;
        const user = await models.user.model.findByIdAndUpdate(id, req.body);

        res.status(201).json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Could not modify user account.',

        })
    }
})

// an admin can change the rights level to someone
router.put('/user/rights/:id', guard({ allow: [UserLevel.Admin] }), schema({ body: user_level_put_schema }), async (req, res) => {
    try {
        const { id } = req.params
        const exists = models.user.model.exists({ _id: id })
        if (!exists) {
            res.status(304).json({
                success: false,
                error: `User ${id} does not exist.`,
            })
        }
        const user = await models.user.model.findByIdAndUpdate(id, { level: levels[req.body.level] });

        res.status(201).json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Could not modify user account.',
        })
    }
})
