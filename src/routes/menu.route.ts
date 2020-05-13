import { Router } from 'express'
const router = Router()

export default router

import * as models from '../models'

import Joi from '@hapi/joi'
import guard from '../middlewares/guard.middleware'
import schema from '../middlewares/schema.middleware'

import { IMenu } from '../models/menu.model'


const menu_attrs_put_schema = Joi.object<IMenu>().options({
    abortEarly: false,
    stripUnknown: true,
})
.keys({
    name : Joi.string().pattern(/^[\p{L}\- ]{2,}$/u).messages({
        'string.base': `'name' should be a string`,
        'string.empty': `'name' cannot be empty`,
        'string.pattern': `'name' is invalid`,
    }),

    products : Joi.array().unique(). messages({
        'array.unique' : `the articles have to appear at most once in a menu`,
    }),

    price : Joi.number().positive().messages({
        'number.positive' : `The price must be positive.`,
    }),

    promotion : Joi.number().positive().messages({
        'number.positive' : `The promotion must be positive.`,
    }),

})

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

router.post('/menu', guard({allow : [models.user.UserLevel.Admin]}),schema({body:menu_attrs_put_schema}), async (req, res) => {
    try {
        const raw = req.body as IMenu

        const menu = await models.menu.model.create({
            name: raw.name.trim().replace(/  +/g, ''),
            products : await Promise.all(raw.products.map(id => models.product.model.findById(id))),
            price : raw.price,
            promotion : raw.promotion,
        })

        res.status(201).json({
            succes: true,
            menu : menu,
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error : "Failed to create menu.",
        })
    }
})