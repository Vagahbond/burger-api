import { Router } from 'express'
const router = Router()
export default router

import validator from 'validator'
import XRegExp from 'xregexp'

import * as models from '../models'

import * as security from '../utils/security.utils'

router.post('/auth/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body || {}

        const errors: string[] = []

        if (typeof firstname !== 'string' || !XRegExp('^[\\p{L}\- ]{2,}$').test(firstname.trim()))
            errors.push("Invalid firstname.")

        if (typeof lastname !== 'string' || !XRegExp('^[\\p{L}\- ]{2,}$').test(lastname.trim()))
            errors.push("Invalid lastname.")

        if (typeof email !== 'string' || !validator.isEmail(email))
            errors.push("Invalid email address.")
        else if (await models.user.model.exists({ email }))
            errors.push("Email address already used.")

        if (typeof password !== 'string' || password.length < 5)
            errors.push("Invalid password (minimum 5 characters needed).")

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
            })
        }

        const user = await models.user.model.create({
            firstname: firstname.trim().replace(/  +/g, ''),
            lastname: lastname.trim().replace(/  +/g, ''),
            email,
            password: await security.hash(password),
        })

        res.json({
            success: true,
            user: models.user.sanitize_user(user),
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Failed to register."
        })
    }
})
