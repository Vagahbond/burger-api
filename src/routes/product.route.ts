import { Router } from 'express'

import * as models from '../models'

const router = Router()
export default router

router.get('/products', async (req, res) => {
    try {
        const products = await models.product.model.find()
        res.json({
            success: true,
            products: products.map(p => models.product.sanitize_product(p)),
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
        const new_product = new models.product.model({
            name: req.body.name,
            count: req.body.count,
            price: req.body.price,
            promotion: req.body.promotion,
        })

        const data = await new_product.save()

        res.json({
            success: true,
            product: models.product.sanitize_product(data),
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Unable to create product',
        })
    }
})
