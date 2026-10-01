import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories || [])
    } catch {
      toast.error('Unable to load categories.')
    }
  }

  // The initial request is intentionally made once when this management page opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadCategories() }, [])

  const resetForm = () => {
    setName('')
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim()) return
    setIsSaving(true)
    try {
      if (editingId) {
        await axios.patch(`/api/categories/${editingId}`, { name }, { withCredentials: true })
        toast.success('Category updated successfully.')
      } else {
        await axios.post('/api/categories', { name }, { withCredentials: true })
        toast.success('Category created successfully.')
      }
      resetForm()
      loadCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save category.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return
    try {
      await axios.delete(`/api/categories/${category._id}`, { withCredentials: true })
      setCategories((current) => current.filter((item) => item._id !== category._id))
      toast.success('Category deleted successfully.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete category.')
    }
  }

  return (
    <section className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
      <div className='mb-6'>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Menu management</p>
        <h3 className='mt-1 text-2xl font-black text-orange-950'>Categories</h3>
        <p className='mt-2 text-sm text-orange-950/60'>Create the categories available when adding products.</p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:flex-row'>
        <input value={name} onChange={(event) => setName(event.target.value)} maxLength='60' required placeholder='e.g. Indian Cuisine' className='flex-1 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200' />
        <div className='flex gap-2'>
          <button disabled={isSaving} className='rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60'>{isSaving ? 'Saving...' : editingId ? 'Update category' : 'Add category'}</button>
          {editingId && <button type='button' onClick={resetForm} className='rounded-full border border-orange-200 px-4 py-2.5 text-sm font-bold text-orange-700 hover:bg-white'>Cancel</button>}
        </div>
      </form>

      <div className='mt-6 overflow-hidden rounded-2xl border border-orange-100'>
        {categories.length === 0 ? <p className='p-6 text-center text-sm text-orange-950/60'>No categories yet. Add one to start organizing products.</p> : categories.map((category) => (
          <div key={category._id} className='flex items-center justify-between gap-4 border-b border-orange-100 px-5 py-4 last:border-0'>
            <span className='font-bold text-orange-950'>{category.name}</span>
            <div className='flex gap-2'>
              <button type='button' onClick={() => { setEditingId(category._id); setName(category.name) }} className='rounded-full border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-50'>Edit</button>
              <button type='button' onClick={() => handleDelete(category)} className='rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50'>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
