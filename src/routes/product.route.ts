import { Router } from 'express'

import * as product from '../models/product.model'

const router = Router()
export default router

router.get('/products', async (req, res) => {
    try {
        const products = await product.model.find()
        res.json({
            success: true,
            products,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Unable to get all products',
        })
    }
})

router.get('/product/:id', async (req, res) => {
    try {
        const searched_product = await product.model.findOne({ id: req.params.id })
        if (searched_product === null) {
            res.status(404).json({
                success: false,
                error: 'Product was not found.',
            })
        } else {
            res.json({
                success: true,
                product: searched_product,
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
        const new_product = new product.model({
            name: req.body.name,
            count: req.body.count,
            price: req.body.price,
            promotion: req.body.promotion,
        })

        const data = await new_product.save()

        res.json({
            success: true,
            product: {
                name: data.name,
                count: data.count,
                price: data.price,
                promotion: data.promotion,
            },
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Unable to create product',
        })
    }
})
