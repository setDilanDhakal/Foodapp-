import { Router } from 'express'
import verifyAdmin from '../middlewares/adminVerifyJWT.js'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js'

const categoryRoute = Router()

categoryRoute.get('/', getCategories)
categoryRoute.post('/', verifyAdmin, createCategory)
categoryRoute.patch('/:id', verifyAdmin, updateCategory)
categoryRoute.delete('/:id', verifyAdmin, deleteCategory)

export { categoryRoute }
