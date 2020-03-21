import { Router } from 'express'
const router = Router()
export default router

import * as models from '../models'
import * as security from '../utils/security.utils'
import validator from 'validator'
import guard from '../middlewares/guard.middleware'

import XRegExp from 'xregexp'

import { UserLevel } from '../models/user.model'


const levels: {[key:string]: models.user.UserLevel} = {
    'admin': models.user.UserLevel.Admin,
    'preparator': models.user.UserLevel.Preparator,
    'customer': models.user.UserLevel.Customer,
  } 

// router.post('/user', async (req,res) => {
//     try {
//         const first_name = req.body.firstname
//         const last_name = req.body.lastname
//         const email = req.body.email
//         const password = security.hash(req.body.email)
//         const level_str = req.body.level
//         const level = levels[level_str.toLowerCase()]

         
    
//         if (!first_name 
//             || !last_name 
//             || !validator.isEmail(email) 
//             || !password 
//             || !level ) {
//             res.status(400).json({
//                 success: false,
//                 err: "Input user is not valid."
//             })
//         }

//         const user = await models.user.model.create({
//             firstname: first_name, 
//             lastname: last_name, 
//             email: email, 
//             password: password, 
//             level: level });
//         res.status(201).json({
//             success: true,
//             user: models.user.sanitize_user(user),
//         })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             success: false,
//             error: "Could not add user.",
            
//         })
//     }
// })

router.get('/users', async (req, res) => {
    try {
        const users = await models.user.model.find()
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
    let level = req.params.level.toString();
    try {
        const user_level = levels[level.toLowerCase()]
        if (user_level === undefined) {
            res.status(400).json({ 
                success: false,
                error : "Provided authentification level is invalid.",
            })
        }
        const users = await models.user.model.find({level: user_level})
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
        const id = req.params.id
        const user = await models.user.model.findById(id);
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
        const mail = req.params.mail
        const user = await models.user.model.find({mail: mail});
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
        const id = req.params.id
        const user = await models.order.model.findById(id).populate("customer")
        
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
        const id = req.params.id
        const user = await models.user.model.findByIdAndRemove(id)
        
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

//a user can change neither his mail adress nor his rights levels
router.put('/user', guard({ allow: [UserLevel.Admin, UserLevel.Customer, UserLevel.Preparator] }),  async (req,res) => {
    try {
        const id: number | null = null
        const firstname: string = ""
        const lastname: string  = ""
        const password: string  = ""
        const user_attributes: { [key:string]: any }  = {}
        const errors: string[] = []

        if ((typeof firstname !== 'string' || !XRegExp('^[\\p{L}\- ]{2,}$').test(firstname.trim())) && firstname !== "")
            errors.push("Invalid firstname.")
        else 
            user_attributes.firstname = firstname

        if ((typeof lastname !== 'string' || !XRegExp('^[\\p{L}\- ]{2,}$').test(lastname.trim())) && lastname !== "")
            errors.push("Invalid lastname.")
            else 
            user_attributes.lastname = lastname



        if ((typeof password !== 'string' || password.length < 5) && password !== "")
            errors.push("Invalid password (minimum 5 characters needed).")
        else 
            user_attributes.password = security.hash(password)

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
            })
        }

        const user = await models.user.model.findByIdAndUpdate(id, user_attributes);
        res.status(201).json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: "Could not modify user account.",
            
        })
    }
})

//an admin can change the rights level to someone 
router.put('/user/:id', guard({ allow: [UserLevel.Admin] }),  async (req,res) => {
    try {
        const id: string | null = req.params.id
        const level_string: string = req.body.level
        const level : UserLevel = levels[level_string]
        if (level === undefined) {
            return res.status(400).json({
                success: false,
                error: "The input level of right is not valid.",
            })
        }

        const user = await models.user.model.findByIdAndUpdate(id, {level: level });
        res.status(201).json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: "Could not modify user account.",
        })
    }
})