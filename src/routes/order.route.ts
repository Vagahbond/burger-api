import { Router } from 'express'
const router = Router()

export default router

import * as models from '../models'

import guard from '../middlewares/guard.middleware'

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
