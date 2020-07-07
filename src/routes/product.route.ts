import { Router } from 'express'

import Joi from '@hapi/joi'

import * as models from '../models'
import schema from '../middlewares/schema.middleware'
import { IProduct } from '../models/product.model'
import guard from '../middlewares/guard.middleware'
import { UserLevel } from '../models/user.model'

const router = Router()
export default router

router.get('/products', async (req, res) => {
    try {
        const products = await models.product.model.find()
        res.json({
            success: true,
            products: products.map((p) => models.product.sanitize_product(p)),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Unable to get all products',
        })
    }
})

router.get('/product/:id', async (req, res) => {
    try {
        const searched_product = await models.product.model.findOne({ _id: req.params.id })
        if (searched_product === null) {
            res.status(404).json({
                success: false,
                error: 'Product was not found.',
            })
        } else {
            res.json({
                success: true,
                product: models.product.sanitize_product(searched_product),
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Unable to get product',
        })
    }
})

const create_product_schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(1)
        .required(),

    count: Joi.number()
        .integer()
        .min(0)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    promotion: Joi.number()
        .integer()
        .min(0)
        .max(1)
        .required(),
})

router.post(
    '/product',
    guard({
        allow: [UserLevel.Admin],
    }),
    async (req, res) => {
        try {
            const received_product = await create_product_schema.validateAsync(req.body)

            const validated_product = new models.product.model(received_product)

            const saved_product = await validated_product.save()

            res.json({
                success: true,
                product: models.product.sanitize_product(saved_product),
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                error: 'Unable to create product',
            })
        }
    },
)

const product_put_schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(1),

    count: Joi.number()
        .integer()
        .min(0),

    price: Joi.number()
        .min(0),

    promotion: Joi.number()
        .integer()
        .min(0)
        .max(1),

    featured: Joi.bool(),
})

router.put(
    '/product/:id',
    guard({
        allow: [UserLevel.Admin],
    }),
    schema({
        body: product_put_schema,
        params: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),
    async (req, res) => {
        try {
            const searched_product = await models.product.model.findOne({ _id: req.params.id })
            if (searched_product === null) {
                res.status(404).json({
                    success: false,
                    error: 'Product was not found.',
                })
            } else {
                const body = req.body as IProduct

                for (const k in body) {
                    type KVObject = { [key: string]: any }
                    (searched_product as KVObject)[k] = (body as KVObject)[k]
                }

                const saved_product = await searched_product.save()

                res.json({
                    success: true,
                    product: models.product.sanitize_product(saved_product),
                })
            }
        } catch (err) {
            console.error(err)

            res.status(400).json({
                success: false,
                error: 'Unable to update product',
            })
        }
    },
)
