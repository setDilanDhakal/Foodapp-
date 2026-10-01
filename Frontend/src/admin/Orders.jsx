import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/orders', { withCredentials: true })
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleAcceptOrder = async (orderId) => {
    setUpdatingId(orderId)
    try {
      await axios.patch(`/api/orders/${orderId}/accept`, {}, { withCredentials: true })
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId ? { ...order, status: 'Accepted' } : order
        )
      )
      toast.success(`Order accepted successfully!`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept order')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    setUpdatingId(orderId)
    try {
      await axios.patch(`/api/orders/${orderId}/cancel`, {}, { withCredentials: true })
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      )
      toast.success('Order has been cancelled.')
    } catch (error) {
      console.error('Failed to cancel order:', error)
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Permanently delete this order record?')) return

    try {
      await axios.delete(`/api/orders/${orderId}`, { withCredentials: true })
      setOrders((current) => current.filter((o) => o._id !== orderId))
      toast.success('Order deleted')
    } catch (error) {
      toast.error('Failed to delete order')
    }
  }

  const handleAdvanceStatus = async (orderId) => {
    setUpdatingId(orderId)
    try {
      const response = await axios.patch(`/api/orders/${orderId}/advance-status`, {}, { withCredentials: true })
      const updated = response.data?.order
      if (updated) {
        setOrders((current) =>
          current.map((order) => (order._id === orderId ? { ...order, status: updated.status } : order))
        )
        toast.success(`Order marked as ${updated.status}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  // Status filter tabs config (Completed = Delivered)
  const STATUS_TABS = [
    { key: 'All', label: 'All' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Accepted', label: 'Accepted' },
    { key: 'Preparing', label: 'Preparing' },
    { key: 'Packing', label: 'Packing' },
    { key: 'On route', label: 'On route' },
    { key: 'Delivered', label: 'Completed' },
    { key: 'Cancelled', label: 'Cancelled' },
  ]

  // Live counts per status (based on search-filtered set, so counts stay in sync)
  const statusCounts = useMemo(() => {
    const base = orders.filter((order) => {
      const search = searchTerm.toLowerCase().trim()
      if (!search) return true
      const matchesCustomer =
        order.name?.toLowerCase().includes(search) ||
        order.phone?.toLowerCase().includes(search) ||
        order.email?.toLowerCase().includes(search) ||
        order.order_id?.toLowerCase().includes(search)
      const matchesItem = order.items?.some((i) => i.name?.toLowerCase().includes(search))
      return matchesCustomer || matchesItem
    })

    const counts = { All: base.length }
    base.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1
    })
    return counts
  }, [orders, searchTerm])

  // Filter orders based on status & search term
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus
      const search = searchTerm.toLowerCase().trim()
      if (!search) return matchesStatus

      const matchesCustomer =
        order.name?.toLowerCase().includes(search) ||
        order.phone?.toLowerCase().includes(search) ||
        order.email?.toLowerCase().includes(search) ||
        order.order_id?.toLowerCase().includes(search)
      const matchesItem = order.items?.some((i) => i.name?.toLowerCase().includes(search))

      return matchesStatus && (matchesCustomer || matchesItem)
    })
  }, [orders, filterStatus, searchTerm])

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-300',
      Accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Preparing: 'bg-blue-100 text-blue-800 border-blue-300',
      Packing: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'On route': 'bg-purple-100 text-purple-800 border-purple-300',
      Delivered: 'bg-green-100 text-green-800 border-green-300',
      Cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-300'
          }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${status === 'Accepted' || status === 'Delivered'
            ? 'bg-emerald-600'
            : status === 'Cancelled'
              ? 'bg-rose-600'
              : status === 'Pending'
                ? 'bg-amber-600'
                : 'bg-blue-600'
            }`}
        />
        {status}
      </span>
    )
  }

  const nextActionLabel = (status) =>
    ({
      Pending: 'Accept Order',
      Accepted: 'Start Preparing',
      Preparing: 'Mark Packed',
      Packing: 'Send On Route',
      'On route': 'Mark Delivered',
    }[status])

  // Helper: tab accent colors per status
  const tabAccent = (key) => {
    switch (key) {
      case 'All': return { active: 'bg-orange-600 text-white border-orange-600', idle: 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50' }
      case 'Pending': return { active: 'bg-amber-500 text-white border-amber-500', idle: 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50' }
      case 'Accepted': return { active: 'bg-emerald-600 text-white border-emerald-600', idle: 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50' }
      case 'Preparing': return { active: 'bg-blue-600 text-white border-blue-600', idle: 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50' }
      case 'Packing': return { active: 'bg-indigo-600 text-white border-indigo-600', idle: 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50' }
      case 'On route': return { active: 'bg-purple-600 text-white border-purple-600', idle: 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50' }
      case 'Delivered': return { active: 'bg-green-600 text-white border-green-600', idle: 'bg-white text-green-700 border-green-200 hover:bg-green-50' }
      case 'Cancelled': return { active: 'bg-rose-600 text-white border-rose-600', idle: 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50' }
      default: return { active: 'bg-orange-600 text-white border-orange-600', idle: 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50' }
    }
  }

  return (
    <div className='space-y-6'>
      {/* Top Banner & Stats */}
      <div className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Administration</p>
            <h1 className='mt-1 text-3xl font-black text-orange-950'>Order Management</h1>
            <p className='mt-1 text-xs text-orange-900/60'>
              Review customer orders, accept new requests, or cancel with real-time database updates.
            </p>
          </div>

          <div className='w-full sm:w-72'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by customer, phone, or food...'
              className='w-full rounded-lg border border-orange-200 bg-orange-50/50 px-3 py-2 text-xs font-medium text-orange-950 placeholder-orange-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition'
            />
          </div>
        </div>

        {/* Status Filter Buttons (with live counts) */}
        <div className='mt-5 flex flex-wrap gap-2 border-t border-orange-100 pt-4'>
          {STATUS_TABS.map(({ key, label }) => {
            const isActive = filterStatus === key
            const accent = tabAccent(key)
            const count = statusCounts[key] || 0
            return (
              <button
                key={key}
                type='button'
                onClick={() => setFilterStatus(key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  isActive ? accent.active : accent.idle
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${
                    isActive ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className='rounded-3xl border border-orange-100 bg-white p-12 text-center text-orange-900/60'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-r-transparent' />
          <p className='mt-3 text-sm font-semibold'>Fetching orders from database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className='rounded-3xl border border-orange-100 bg-white p-12 text-center text-orange-900/60'>
          <span className='text-5xl'>🍽️</span>
          <p className='mt-3 text-lg font-bold text-orange-950'>No orders placed yet</p>
          <p className='mt-1 text-xs text-orange-900/50'>When customers place orders from the cart, they will appear here.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='rounded-3xl border border-orange-100 bg-white p-12 text-center text-orange-900/60'>
          <p className='text-sm font-bold text-orange-950'>
            No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} orders
            {searchTerm ? ` matching "${searchTerm}"` : ''}
          </p>
          <button
            onClick={() => {
              setFilterStatus('All')
              setSearchTerm('')
            }}
            className='mt-3 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold text-orange-800 hover:bg-orange-200'
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* ========================================================
           TABLE VIEW
           ======================================================== */
        <div className='overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left'>
              <thead>
                <tr className='border-b border-orange-100 bg-orange-50/50 text-xs font-bold uppercase tracking-wide text-orange-600'>
                  <th className='py-3.5 px-4'>Order ID</th>
                  <th className='py-3.5 px-4'>Customer Name</th>
                  <th className='py-3.5 px-4'>Number of Items</th>
                  <th className='py-3.5 px-4'>Items Ordered</th>
                  <th className='py-3.5 px-4'>Total</th>
                  <th className='py-3.5 px-4'>Status</th>
                  <th className='py-3.5 px-4'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-orange-50'>
                {filteredOrders.map((order) => {
                  const totalItems = order.items?.reduce((s, i) => s + (Number(i.quantity) || 1), 0) || 0

                  return (
                    <tr key={order._id} className='align-top hover:bg-orange-50/30 transition'>
                      <td className='py-4 px-4 font-mono font-bold text-xs text-orange-950'>
                        #{order.order_id || order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className='py-4 px-4'>
                        <div className='font-bold text-orange-950'>{order.name || 'Customer'}</div>
                        {order.phone && <div className='text-xs text-orange-800/70'>📞 {order.phone}</div>}
                        {order.address && <div className='text-xs text-orange-800/50 truncate max-w-xs'>📍 {order.address}</div>}
                      </td>

                      <td className='py-4 px-4'>
                        <span className='rounded-full bg-orange-100 px-2.5 py-1 text-xs font-black text-orange-800'>
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      <td className='py-4 px-4 text-orange-900 max-w-xs'>
                        <ul className='space-y-1 text-xs font-medium'>
                          {order.items?.map((item, idx) => (
                            <li key={idx} className='flex items-center justify-between gap-2 border-b border-orange-50 pb-1'>
                              <span>{item.name}</span>
                              <span className='font-bold text-orange-700'>x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className='py-4 px-4 font-black text-sm text-emerald-600'>
                        रु {Number(order.total).toFixed(2)}
                      </td>

                      <td className='py-4 px-4'>
                        {getStatusBadge(order.status)}
                      </td>

                      <td className='py-4 px-4'>
                        <div className='flex flex-wrap gap-1.5'>
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleAcceptOrder(order._id)}
                              disabled={updatingId === order._id}
                              className='rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700'
                            >
                              Accept
                            </button>
                          )}
                          {nextActionLabel(order.status) && order.status !== 'Pending' && (
                            <button
                              onClick={() => handleAdvanceStatus(order._id)}
                              disabled={updatingId === order._id}
                              className='rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 whitespace-nowrap'
                            >
                              {nextActionLabel(order.status)} &rarr;
                            </button>
                          )}
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={updatingId === order._id}
                              className='rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-200'
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders