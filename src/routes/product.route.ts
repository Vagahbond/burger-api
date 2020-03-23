import { Router } from 'express'

import Joi from '@hapi/joi'

import * as models from '../models'

const router = Router()
export default router

const schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(1)
        .required(),

    count: Joi.number()
        .integer()
        .min(0)
        .required(),

    price: Joi.number()
        .integer()
        .min(0)
        .required(),

    promotion: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required(),
})

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

router.post('/product', async (req, res) => {
    try {
        const received_product = await schema.validateAsync(req.body)

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
})
