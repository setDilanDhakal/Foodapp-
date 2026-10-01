import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ITEMS_PER_PAGE = 15
const MAX_VISIBLE_PAGES = 3

function Products() {
  const [foods, setFoods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadFoods = async () => {
      try {
        const response = await axios.get('/api/food/getfood', { withCredentials: true })
        if (isMounted) {
          setFoods(response.data.foods || [])
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.response?.data?.message || 'Unable to load products.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadFoods()

    return () => {
      isMounted = false
    }
  }, [])

  // Filter foods by search term (case-insensitive name match)
  const filteredFoods = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return foods
    return foods.filter((food) => food.name?.toLowerCase().includes(term))
  }, [foods, searchTerm])

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Pagination calculations (based on filtered list)
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedFoods = useMemo(
    () => filteredFoods.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredFoods, startIndex]
  )

  // Clamp current page if it exceeds total pages (e.g. after delete or search)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
  }

  // Build a compact page list: at most 3 numbered buttons + ellipses
  const pageNumbers = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES + 2) {
      // e.g. 1 2 3 4 5  (5 or fewer total pages — show all)
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = []
    pages.push(1)

    // Determine the window of numbered pages around currentPage
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Keep exactly 3 numbered slots in the middle when possible
    if (currentPage <= 2) {
      start = 2
      end = 3
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 2
      end = totalPages - 1
    } else {
      start = currentPage - 1
      end = currentPage + 1
    }

    // Ensure we don't push more than 3 middle numbers
    const middleCount = end - start + 1
    if (middleCount > MAX_VISIBLE_PAGES) {
      // Trim from the side opposite to current page
      if (currentPage - start > end - currentPage) {
        start = end - MAX_VISIBLE_PAGES + 1
      } else {
        end = start + MAX_VISIBLE_PAGES - 1
      }
    }

    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')

    pages.push(totalPages)
    return pages
  }, [totalPages, currentPage])

  const handleDelete = async (food) => {
    if (!window.confirm(`Delete ${food.name}?`)) return
    setDeletingId(food._id)
    try {
      await axios.delete(`/api/food/${food._id}`, { withCredentials: true })
      toast.success('Product deleted successfully.', { position: 'top-center' })
      setFoods((prev) => prev.filter((item) => item._id !== food._id))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const isSearching = searchTerm.trim().length > 0

  return (
    <section className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
      {/* Header */}
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Menu management</p>
          <h3 className='mt-1 text-2xl font-black text-orange-950'>All products</h3>
          {!isLoading && filteredFoods.length > 0 && (
            <p className='mt-1 text-xs font-medium text-orange-950/50'>
              Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredFoods.length)} of {filteredFoods.length}
              {isSearching && ` (filtered from ${foods.length})`} items
            </p>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {/* Search input */}
          <div className='relative'>
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-orange-400'>
              🔍
            </span>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by product name...'
              className='w-56 rounded-full border border-orange-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-orange-950 placeholder-orange-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
            />
            {searchTerm && (
              <button
                type='button'
                onClick={() => setSearchTerm('')}
                aria-label='Clear search'
                className='absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-orange-400 hover:bg-orange-100 hover:text-orange-700'
              >
                ✕
              </button>
            )}
          </div>

          <Link to='/admin/products/add' className='rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700'>
            Add product
          </Link>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full text-left'>
          <thead>
            <tr className='border-b border-orange-100 text-xs font-bold uppercase tracking-wide text-orange-500'>
              <th className='px-4 py-3'>S.N.</th>
              <th className='px-4 py-3'>Food item</th>
              <th className='px-4 py-3'>Category</th>
              <th className='px-4 py-3'>Price</th>
              <th className='px-4 py-3'>Stock</th>
              <th className='px-4 py-3 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan='6' className='px-4 py-8 text-center text-sm text-orange-950/60'>Loading products...</td></tr>
            )}
            {!isLoading && foods.length === 0 && (
              <tr><td colSpan='6' className='px-4 py-8 text-center text-sm text-orange-950/60'>No food items have been added yet.</td></tr>
            )}
            {!isLoading && foods.length > 0 && filteredFoods.length === 0 && (
              <tr>
                <td colSpan='6' className='px-4 py-8 text-center text-sm text-orange-950/60'>
                  No products match "<span className='font-bold text-orange-700'>{searchTerm}</span>".
                </td>
              </tr>
            )}
            {paginatedFoods.map((food, index) => (
              <tr key={food._id} className='border-b border-orange-50 text-sm last:border-0 hover:bg-orange-50/60'>
                <td className='px-4 py-4 font-bold text-orange-500'>{startIndex + index + 1}</td>
                <td className='px-4 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-100 text-lg'>
                      {food.image ? <img src={food.image} className='h-full w-full object-cover' alt='' /> : '🍽️'}
                    </div>
                    <span className='font-black text-orange-950'>{food.name}</span>
                  </div>
                </td>
                <td className='px-4 py-4 text-orange-950/70'>{food.category}</td>
                <td className='px-4 py-4 font-black text-emerald-600'>रु {Number(food.price).toLocaleString()}</td>
                <td className='px-4 py-4 font-semibold text-orange-950/80'>{food.stock}</td>
                <td className='px-4 py-4 text-right'>
                  <div className='flex justify-end gap-2'>
                    <button type='button' onClick={() => navigate('/admin/products/add', { state: { food } })} className='rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100'>Edit</button>
                    <button type='button' onClick={() => handleDelete(food)} disabled={deletingId === food._id} className='rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60'>{deletingId === food._id ? 'Deleting...' : 'Delete'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className='mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 pt-4'>
          <p className='text-xs font-medium text-orange-950/60'>
            Page <span className='font-bold text-orange-700'>{currentPage}</span> of{' '}
            <span className='font-bold text-orange-700'>{totalPages}</span>
          </p>

          <div className='flex items-center gap-1.5'>
            <button
              type='button'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white'
            >
              ← Prev
            </button>

            {pageNumbers.map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className='px-2 text-xs font-bold text-orange-400'>
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type='button'
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[34px] rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    currentPage === page
                      ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                      : 'border-orange-200 bg-white text-orange-700 hover:bg-orange-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type='button'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white'
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Products