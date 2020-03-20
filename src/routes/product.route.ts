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
