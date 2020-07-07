import { Router } from 'express'

import Joi from '@hapi/joi'

import * as models from '../models'

import guard from '../middlewares/guard.middleware'
import schema from '../middlewares/schema.middleware'

import { UserLevel } from '../models/user.model'
import { OrderStatus } from '../models/order.model'
import { IProduct } from '../models/product.model'
import { IMenu } from '../models/menu.model'

const router = Router()

export default router

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
    } catch (err) {
        console.error(err)

        res.status(500).json({
            succes: false,
            error: 'Error while fetching orders.',
        })
    }
})

router.get(
    '/orders/:id',
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
        } catch (err) {
            console.error(err)

            res.status(500).json({
                succes: false,
                error: 'Error while fetching the order.',
            })
        }
    },
)

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
            })
        } catch (err) {
            console.error(err)

            res.status(500).json({
                succes: false,
                error: 'Error while updating the order.',
            })
        }
    })

router.post('/orders/:id/done',
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
                status: OrderStatus.Done,
            })

            res.json({
                success: true,
            })
        } catch (err) {
            console.error(err)

            res.status(500).json({
                succes: false,
                error: 'Error while updating the order.',
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
                },
            }).lean()

            const product_counter: { [key: string]: number } = {}

            if (products.length < body.products.length) {
                for (const id of body.products) {
                    if (!products.some((product) => product._id === id)) {
                        return res.status(400).json({
                            success: false,
                            error: `Product with id '${id}' doesn't exists.`,
                        })
                    }
                }
            }

            for (const product of products) {
                if (product.count <= 0) {
                    return res.status(400).json({
                        success: false,
                        error: `There is no more products with id '${product._id}' available.`,
                    })
                }

                product_counter[product._id] = product.count - 1;
            }

            const menus = await models.menu.model.find({
                _id: {
                    $in: body.menus,
                },
            }).populate('products')

            if (menus.length < body.menus.length) {
                for (const id of body.menus) {
                    if (!menus.some((menu) => menu._id === id)) {
                        return res.status(400).json({
                            success: false,
                            error: `Menu with id '${id}' doesn't exists.`,
                        })
                    }
                }
            }

            for (const menu of menus) {
                for (const product of menu.products as IProduct[]) {
                    const counter = product_counter[`${product._id}`] || product.count

                    if (counter <= 0) {
                        return res.status(400).json({
                            success: false,
                            error: `There is no more products with id '${product._id}' available.`,
                        })
                    }

                    product_counter[`${product._id}`] = counter - 1;
                }
            }

            for (const id in product_counter) {
                await models.product.model.updateOne({ _id: id }, {
                    count: product_counter[id],
                })
            }

            const order = await models.order.model.create({
                status: OrderStatus.InProgress,
                customer: req.user?._id,
                products: products.map<IProduct>((product) => ({
                    name: product.name,
                    count: 1,
                    price: product.price,
                    promotion: product.promotion,
                })),
                menus: menus.map<IMenu>((menu) => {
                    const products = menu.products as IProduct[]

                    return {
                        name: menu.name,
                        price: menu.price,
                        promotion: menu.promotion,
                        products: products.map<IProduct>((product) => ({
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
        } catch (err) {
            console.error(err)

            res.status(500).json({
                succes: false,
                error: 'Error while creating the order.',
            })
        }
    },
)
