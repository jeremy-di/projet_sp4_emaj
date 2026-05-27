
import { Router } from "express";
import { register, generate2FA, enable2FA, login, verify2FA, getAllUsers, getUserById, getMe, updateUser, updateMe, updateMyPassword, deleteUser } from "../controllers/user.controller.js"
import auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/login/2fa', verify2FA)
router.post('/2fa/generate', auth, generate2FA)
router.post('/2fa/enable', auth, enable2FA)
router.get('/all', auth, admin, getAllUsers)
router.get('/profil/me', auth, getMe)
router.patch('/updateme', auth, updateMe)
router.patch('/updatemypass', auth, updateMyPassword)
router.get('/:id', auth, admin, getUserById)
router.put('/:id', auth, admin, updateUser)
router.delete('/:id', auth, admin, deleteUser)

export default router