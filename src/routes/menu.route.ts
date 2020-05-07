import { Router } from 'express'
const router = Router()

export default router

import * as models from '../models'

import guard from '../middlewares/guard.middleware'

router.get('/menus', async (req, res) => {
    try {
        const menus = await models.menu.model.find()
        res.json({
            success: true,
            menus: menus,
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            succes: false,
            error: 'Could not query menus.'
        })
    }
})

router.get('/menu/:id', async (req, res) => {
    try {

        const id = req.params.id
        const menu = await models.menu.model.findById(id)

        if (menu === undefined) {
            res.status(404).json({
                success : false, 
                error : `Menu with ID ${id} does not exist.`,
            })
        }

        res.json({
            success : true,
            menu : menu,
        })

    } 
    catch (err) {
        console.log(err)
        res.json(500).json({
            success : false,
            error : "Could not query menu.",
        })
    }
})
