
import { Router } from "express";
import { register, generate2FA, enable2FA, login, verify2FA, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js"
import auth from '../middlewares/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/login/2fa', verify2FA)
router.post('/2fa/generate', auth, generate2FA)
router.post('/2fa/enable', auth, enable2FA)
router.get('/all', auth, getAllUsers)
router.get('/:id', auth, getUserById)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteUser)

export default router