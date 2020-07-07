import { Router } from 'express'

import * as models from '../models'

const router = Router()
export default router

router.get('/featured', async (req, res) => {
    try {
        const products = await models.product.model.find({ featured: true })
        const menus = await models.menu.model.find({ featured: true }).populate('products')

        res.json({
            success: true,
            products: products.map((p) => models.product.sanitize_product(p)),
            menus: menus.map((p) => models.menu.sanitize_menu(p)),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Unable to get all products',
        })
    }
})
