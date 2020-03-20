import { Router } from 'express'
const router = Router()
export default router

router.get('/auth/register', (req, res) => {
    res.json({
        success: true,
    })
})
