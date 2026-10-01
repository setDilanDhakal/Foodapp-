import { Router } from 'express'
import multer from 'multer'
import os from 'os'
import {
    login,
    register,
    verifyRegistrationEmail,
    createAdmin,
    logout,
    profile,
    fetchUser,
    changePassword,
    updateProfile,
    uploadAvatar,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
} from '../controllers/user.controller.js'
import verifyJWT from '../middlewares/verifyJWT.js'
import verifyAdmin from '../middlewares/adminVerifyJWT.js'

const userRouter = Router()
const upload = multer({ dest: os.tmpdir() })

userRouter.post('/register', upload.single('profile'), register)
userRouter.post('/verify-registration-email', verifyRegistrationEmail)
userRouter.post('/admin', verifyAdmin, createAdmin)
userRouter.post('/login', login)
userRouter.post('/logout', verifyJWT, logout)
userRouter.get('/profile', verifyJWT, profile)
userRouter.get('/', fetchUser)
userRouter.post('/changepassword', verifyJWT, changePassword)

// ── Profile update ──
userRouter.put('/profile', verifyJWT, updateProfile)

// ── Avatar upload (Cloudinary via Multer) ──
userRouter.post('/profile/avatar', verifyJWT, upload.single('avatar'), uploadAvatar)

// ── Forgot Password ──
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/verify-forgot-password', verifyForgotPasswordOtp)
userRouter.post('/reset-password', resetPassword)

export default userRouter
