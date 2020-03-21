import { Router } from 'express'
const router = Router()
export default router

import * as models from '../models'
import * as security from '../utils/security.utils'
import * as validator from 'validator'

const levels = {
    'admin': models.user.UserLevel.Admin,
    'preparator': models.user.UserLevel.Preparator,
    'customer': models.user.UserLevel.Customer,
  } as const

router.post('/user', async (req,res) => {
    try {
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = security.hash(req.body.email);
        let level = levels[req.body.toLowerCase()];
    
        if (!first_name 
            || !last_name 
            || !validator.default.isEmail(email) 
            || !password 
            || !level ) {
            res.status(400).json({
                success: false,
                err: "Input user is not valid."
            })
        }

        const user = await models.user.model.create({firstname: first_name, 
            lastname: last_name, 
            email: email, 
            password: password, 
            level: level });
        res.status(201).json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: "Could not add user.",
            
        })
    }
})

router.get('/users', async (req, res) => {
    try {
        let users = await models.user.model.find()
        res.json({
            success: true,
            users: users.map(user => models.user.sanitize_user(user)),
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            error : "Could not query users.",
        })
    }
    
})

router.get('/users/:level', async (req, res) => {
    let level = req.params.level;
    try {
        let user_level = levels[level.toLowerCase()];
        if (user_level === undefined) {
            res.status(400).json({ 
                success: false,
                error : "Provided authentification level is invalid.",
            })
        }
        let users = await models.user.model.find({level: user_level})
        res.json({
            success: true,
            preparators: users.map(prep => models.user.sanitize_user(prep)),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            error : `Could not query users with level ${level}.`,
        })
    }
}) 

router.get('user/:id', async (req, res) => {
    try {
        let id = req.params.id
        let user = await models.user.model.findById(id);
        if (user === undefined) {
            res.status(404).json({ 
                success: false,
                error : `User with ID ${id} does not exist.`,
            })
        }
        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            error : "Could not query user.",
        })
    }
})

router.get('user/mail/:mail', async (req, res) => {
    try {
        let mail = req.params.mail
        let user = await models.user.model.find({mail: mail});
        if (user === undefined) {
            res.status(404).json({ 
                success: false,
                error : `User with email ${mail} does not exist.`,
            })
        }
        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            error : "Could not query user.",
        })
    }
})

router.get('user/who_ordered/:id', async (req, res) => {
    try {
        let id = req.params.id
        let user = await models.order.model.findById(id).populate("customer")
        
        if (user === undefined) {
            res.status(404).json({ 
                success: false,
                error : `User who did the order with ID ${id} does not exist.`,
            })
        }
        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            error : "Could not query user.",
        })
    }
})

router.delete('user/:id', async (req, res) => {
    try {
        let id = req.params.id
        let user = await models.user.model.findOneAndDelete({_id: id})
        
        if (user === undefined) {
            res.status(404).json({ 
                success: false,
                error : `User who dade the order with ID ${id} does not exist.`,
            })
        }
        res.status(410).json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            error : "Could not query user.",
        })
    }
})

