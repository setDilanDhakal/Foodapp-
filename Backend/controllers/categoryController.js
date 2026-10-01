import { Category } from '../models/categoryModel.js'
import { foodItems } from '../models/foodModel.js'

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    return res.status(200).json({ categories })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to get categories' })
  }
}

export const createCategory = async (req, res) => {
  const name = req.body.name?.trim()
  if (!name) return res.status(400).json({ message: 'Category name is required' })

  try {
    const category = await Category.create({ name })
    return res.status(201).json({ message: 'Category created successfully', category })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'A category with this name already exists' })
    return res.status(500).json({ message: 'Unable to create category' })
  }
}

export const updateCategory = async (req, res) => {
  const name = req.body.name?.trim()
  if (!name) return res.status(400).json({ message: 'Category name is required' })

  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })

    const previousName = category.name
    category.name = name
    await category.save()
    await foodItems.updateMany({ category: previousName }, { category: name })
    return res.status(200).json({ message: 'Category updated successfully', category })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'A category with this name already exists' })
    return res.status(500).json({ message: 'Unable to update category' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })

    const productCount = await foodItems.countDocuments({ category: category.name })
    if (productCount) return res.status(400).json({ message: 'Move or update products in this category before deleting it' })

    await category.deleteOne()
    return res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete category' })
  }
}
