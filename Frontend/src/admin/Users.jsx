import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const USERS_PER_PAGE = 10

function Users() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', { withCredentials: true })
        if (isMounted) setUsers(response.data.users || [])
      } catch (error) {
        if (isMounted) toast.error('Failed to fetch users')
        console.error('Error fetching users:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchUsers()
    return () => {
      isMounted = false
    }
  }, [])

  // Only customers
  const customers = useMemo(
    () => users.filter((user) => user.role === 'user'),
    [users]
  )

  const totalPages = Math.max(1, Math.ceil(customers.length / USERS_PER_PAGE))

  // Keep currentPage within bounds if the list changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const endIndex = startIndex + USERS_PER_PAGE
  const paginatedUsers = customers.slice(startIndex, endIndex)

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(1, page), totalPages)
    setCurrentPage(clamped)
  }

  // Build a compact page-number list: 1 … 4 5 [6] 7 8 … 12
  const pageNumbers = useMemo(() => {
    const pages = []
    const maxButtons = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxButtons - 1)
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('…')
    }
    for (let p = start; p <= end; p += 1) pages.push(p)
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('…')
      pages.push(totalPages)
    }
    return pages
  }, [currentPage, totalPages])

  return (
    <div className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Customers</p>
          <h3 className='mt-1 text-2xl font-black text-orange-950'>Users</h3>
        </div>
        {!isLoading && customers.length > 0 && (
          <p className='text-xs font-bold uppercase tracking-wide text-orange-950/60'>
            Showing {startIndex + 1}–{Math.min(endIndex, customers.length)} of {customers.length}
          </p>
        )}
      </div>

      {isLoading && (
        <p className='py-10 text-center text-sm text-orange-950/60'>Loading users...</p>
      )}

      {!isLoading && customers.length === 0 && (
        <p className='py-10 text-center text-sm text-orange-950/60'>No customers yet.</p>
      )}

      <div className='space-y-3'>
        {paginatedUsers.map((user) => (
          <div
            key={user._id || user.email}
            className='flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 p-4'
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white'>
                {user.name
                  ?.split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className='font-black text-orange-950'>{user.name}</p>
                <p className='text-sm text-orange-700'>{user.email}</p>
              </div>
            </div>

            <span className='rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700'>
              {user.role}
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className='mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 pt-4'>
          <button
            type='button'
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className='rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40'
          >
            ← Previous
          </button>

          <div className='flex items-center gap-1'>
            {pageNumbers.map((p, idx) =>
              p === '…' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className='px-2 text-sm font-bold text-orange-950/40'
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type='button'
                  onClick={() => goToPage(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                  className={`min-w-[36px] rounded-full px-3 py-2 text-xs font-bold transition ${
                    p === currentPage
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'border border-orange-200 bg-white text-orange-700 hover:bg-orange-50'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type='button'
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40'
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Users