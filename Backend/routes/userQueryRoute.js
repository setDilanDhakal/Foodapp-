import { Router } from 'express'
import { createUserQuery, getUserQueries } from '../controllers/userQueryController.js'
import verifyAdmin from '../middlewares/adminVerifyJWT.js';


const userQueryRouter = Router();

userQueryRouter.post('/feedback', createUserQuery)
userQueryRouter.get('/feedback', verifyAdmin, getUserQueries)

export {
    userQueryRouter
}