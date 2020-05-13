import { Router } from 'express'
const router = Router()

export default router

import Joi from '@hapi/joi'

import * as models from '../models'

import guard from '../middlewares/guard.middleware'
import schema from '../middlewares/schema.middleware'

import { UserLevel } from '../models/user.model'
import { OrderStatus } from '../models/order.model'
import { IProduct } from '../models/product.model'
import { IMenu } from '../models/menu.model'

router.get('/orders', guard({
    allow: [UserLevel.Admin, UserLevel.Preparator],
}), async (req, res) => {
    try {
        const orders = await models.order.model.find().sort({
            creation_date: 'asc',
        })

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


router.post('/orders/:id/cancel',
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
            const order = await models.order.model.updateOne({
                _id: req.params.id,
            }, {
                status: OrderStatus.Cancelled,
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

router.post(
    '/orders',
    schema({
        body: Joi.object({
            products: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(),
            menus: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(),
        }),
    }),
    async (req, res) => {
        try {
            interface ICurrentOrder {
                products: string[]
                menus: string[]
            }

            const body = req.body as ICurrentOrder;

            const products = await models.product.model.find({
                _id: {
                    $in: body.products,
                }
            }).lean()

            if (products.length < body.products.length) {
                for (const id of body.products) {
                    if (!products.some(product => product._id === id)) {
                        return res.json({
                            success: false,
                            error: `Product with id '${id}' doesn't exists.`,
                        })
                    }
                }
            }

            const menus = await models.menu.model.find({
                _id: {
                    $in: body.menus,
                }
            })

            if (menus.length < body.menus.length) {
                for (const id of body.menus) {
                    if (!menus.some(menu => menu._id === id)) {
                        return res.json({
                            success: false,
                            error: `Menu with id '${id}' doesn't exists.`,
                        })
                    }
                }
            }

            const order = await models.order.model.create({
                status: OrderStatus.InProgress,
                customer: req.user?._id,
                products: products.map<IProduct>(product => ({
                    name: product.name,
                    count: 1,
                    price: product.price,
                    promotion: product.promotion,
                })),
                menus: menus.map<IMenu>(menu => {
                    const products = menu.populate('products').products as IProduct[]

                    return {
                        name: menu.name,
                        price: menu.price,
                        promotion: menu.price,
                        products: products.map<IProduct>(product => ({
                            name: product.name,
                            count: product.count,
                            price: product.price,
                            promotion: product.promotion,
                        })),
                    }
                }),
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
                error: 'Error while creating the order.'
            })
        }
    })
