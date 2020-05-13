import { Router } from 'express'
const router = Router()

export default router

import Joi from '@hapi/joi'

import * as models from '../models'

import guard from '../middlewares/guard.middleware'
import schema from '../middlewares/schema.middleware'

import { UserLevel } from '../models/user.model'

router.get('/orders', guard({
    allow: [UserLevel.Admin, UserLevel.Preparator],
}), async (req, res) => {
    try {
        const orders = await models.order.model.find()

        res.json({
            success: true,
            orders,
        })
    }
    catch (err) {
        console.error(err)

        res.status(500).json({
            succes: false,
            error: 'Error while fetching orders.'
        })
    }
})

router.get(
    '/order/:id',
    schema({
        params: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),
    guard({
        allow: [UserLevel.Admin, UserLevel.Preparator],
    }),
    async (req, res) => {
        try {
            const order = await models.order.model.findOne({
                _id: req.params.id,
            })

            res.json({
                success: true,
                order,
            })
        }
        catch (err) {
            console.error(err)

            res.status(500).json({
                succes: false,
                error: 'Error while fetching the order.'
            })
        }
    })
