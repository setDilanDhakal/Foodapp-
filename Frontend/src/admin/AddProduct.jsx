import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
  preparationTime: '',
  image: '',
  description: '',
}

function AddProduct() {
  const location = useLocation()
  const navigate = useNavigate()
  const editingFood = location.state?.food
  const [formData, setFormData] = useState(editingFood ? {
    name: editingFood.name || '',
    category: editingFood.category || '',
    price: editingFood.price ?? '',
    stock: editingFood.stock ?? '',
    preparationTime: editingFood.preparationTime || '',
    image: '',
    description: editingFood.description || '',
  } : emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/categories')
        setCategories(response.data.categories || [])
      } catch {
        toast.error('Unable to load categories.')
      } finally {
        setIsLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  const handleChange = (event) => {
    const { name, value, files } = event.target
    setFormData((currentData) => ({
      ...currentData,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    const productData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image' || value) productData.append(key, value)
    })

    try {
      if (editingFood) {
        await axios.patch(`/api/food/${editingFood._id}`, productData, { withCredentials: true })
      } else {
        await axios.post('/api/food/additem', productData, { withCredentials: true })
      }
      toast.success(editingFood ? 'Product updated successfully.' : 'Product added successfully.', { position: 'top-center' })
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || `Unable to ${editingFood ? 'update' : 'add'} product.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Menu management</p>
          <h3 className='mt-1 text-2xl font-black text-orange-950'>{editingFood ? 'Edit product' : 'Add product'}</h3>
        </div>
        <Link to='/admin/products' className='rounded-full border border-orange-200 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50'>Back to products</Link>
      </div>

      <form onSubmit={handleSubmit} className='rounded-2xl border border-orange-200 bg-orange-50 p-5'>
        <div className='grid gap-4 md:grid-cols-2'>
          <label className='text-sm font-semibold text-orange-950'>
            Food item name
            <input type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='e.g. Tandoori Butter Bowl' className='mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200' />
          </label>
          <label className='text-sm font-semibold text-orange-950'>
            Category
            <select name='category' value={formData.category} onChange={handleChange} required disabled={isLoadingCategories || categories.length === 0} className='mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-orange-100'>
              <option value=''>{isLoadingCategories ? 'Loading categories...' : categories.length ? 'Select a category' : 'Create a category first'}</option>
              {categories.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}
            </select>
            {!isLoadingCategories && categories.length === 0 && <Link to='/admin/categories' className='mt-2 inline-block text-xs font-bold text-orange-700 underline'>Manage categories</Link>}
          </label>
          <label className='text-sm font-semibold text-orange-950'>
            Price
            <input type='number' name='price' value={formData.price} onChange={handleChange} min='0' required placeholder='1806' className='mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200' />
          </label>
          <label className='text-sm font-semibold text-orange-950'>
            Stock
            <input type='number' name='stock' value={formData.stock} onChange={handleChange} min='0' required placeholder='25' className='mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200' />
          </label>
          <label className='text-sm font-semibold text-orange-950'>
            Preparation time
            <input type='text' name='preparationTime' value={formData.preparationTime} onChange={handleChange} required placeholder='30 minutes' className='mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200' />
          </label>
          <label className='text-sm font-semibold text-orange-950'>
            Food image
            <input type='file' name='image' onChange={handleChange} accept='image/*' required={!editingFood} className='mt-2 block w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:font-semibold file:text-orange-700' />
          </label>
          <label className='text-sm font-semibold text-orange-950 md:col-span-2'>
            Description
            <textarea name='description' value={formData.description} onChange={handleChange} rows='3' placeholder='Describe the ingredients and flavor.' className='mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200' />
          </label>
        </div>

        <div className='mt-5 flex justify-end'>
          <button type='submit' disabled={isSubmitting} className='rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60'>
            {isSubmitting ? 'Saving...' : editingFood ? 'Update product' : 'Save product'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddProduct
