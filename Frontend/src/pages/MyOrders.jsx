import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Which bucket is showing: 'active' (default), 'delivered', 'cancelled'
  const [view, setView] = useState('active')

  // Edit state
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [editItems, setEditItems] = useState([])
  const [savingOrder, setSavingOrder] = useState(false)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/orders/my-orders', { withCredentials: true })
        setOrders(response.data.orders || [])
      } catch (e) {
        if (e.response?.status === 401) {
          toast.error('Please login to view your orders')
          navigate('/login')
        } else {
          toast.error('Failed to load orders')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [navigate])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

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
    const dot = {
      Accepted: 'bg-emerald-600',
      Delivered: 'bg-emerald-600',
      Cancelled: 'bg-rose-600',
      Pending: 'bg-amber-600',
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
          styles[status] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dot[status] || 'bg-blue-600'}`} />
        {status}
      </span>
    )
  }

  // ── Order buckets ───────────────────────────────────────────────────────
  // Active = anything not Delivered / Cancelled. Preparing & Packing orders
  // are pushed to the very top so the kitchen-ready ones are immediately visible.
  const activeOrders = useMemo(() => {
    const rank = (status) => {
      // Priority order for "active" section — Preparing / Packing first
      switch (status) {
        case 'Preparing': return 0
        case 'Packing':   return 1
        case 'On route':  return 2
        case 'Accepted':  return 3
        case 'Pending':   return 4
        default:          return 5
      }
    }
    return orders
      .filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
      .sort((a, b) => rank(a.status) - rank(b.status))
  }, [orders])

  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === 'Delivered'),
    [orders]
  )
  const cancelledOrders = useMemo(
    () => orders.filter((o) => o.status === 'Cancelled'),
    [orders]
  )

  const visibleOrders =
    view === 'delivered' ? deliveredOrders :
    view === 'cancelled' ? cancelledOrders :
    activeOrders

  // ── Edit helpers ─────────────────────────────────────────────────────────
  const startEditing = (order) => {
    setEditingOrderId(order._id)
    setEditItems(order.items.map((i) => ({ ...i })))
  }

  const cancelEditing = () => {
    setEditingOrderId(null)
    setEditItems([])
  }

  const changeItemQty = (itemId, delta) => {
    setEditItems((prev) =>
      prev.map((i) =>
        i._id === itemId ? { ...i, quantity: Math.max(1, (i.quantity || 1) + delta) } : i
      )
    )
  }

  const saveOrderEdits = async (orderId) => {
    setSavingOrder(true)
    try {
      const response = await axios.patch(
        `/api/orders/${orderId}/update-items`,
        { items: editItems.map((i) => ({ _id: i._id, quantity: i.quantity })) },
        { withCredentials: true }
      )
      const updated = response.data.order
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o)))
      toast.success('Order updated successfully!')
      cancelEditing()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order')
    } finally {
      setSavingOrder(false)
    }
  }

  const handleUserCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancellingOrderId(orderId)
    try {
      await axios.patch(`/api/orders/${orderId}/user-cancel`, {}, { withCredentials: true })
      // Move it into the "Cancelled" bucket rather than removing it
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: 'Cancelled' } : o))
      )
      toast.success('Order cancelled.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancellingOrderId(null)
    }
  }

  // ── Render one order card (shared between views) ────────────────────────
  const renderOrderCard = (order) => {
    const isEditing = editingOrderId === order._id
    const displayItems = isEditing ? editItems : order.items
    const totalQty = displayItems?.reduce((s, i) => s + (Number(i.quantity) || 1), 0) || 0
    const displayTotal = isEditing
      ? editItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0)
      : Number(order.total)
    const canEdit = order.status === 'Pending'

    return (
      <div
        key={order._id}
        className={`rounded-2xl border bg-white transition ${
          isEditing
            ? 'border-orange-400 shadow-lg ring-2 ring-orange-100'
            : 'border-orange-100 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Card header */}
        <div className='flex flex-col gap-3 px-5 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between border-b border-orange-50'>
          <div className='flex flex-wrap items-center gap-3'>
            <span className='font-mono font-bold text-xs bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 text-orange-950'>
              #{order.order_id || order._id.slice(-6).toUpperCase()}
            </span>
            {getStatusBadge(order.status)}
            <span className='text-xs text-slate-400'>{formatDate(order.createdAt)}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-xs font-semibold text-slate-500'>
              {totalQty} {totalQty === 1 ? 'item' : 'items'}
            </span>
            <span className='text-lg font-black text-emerald-600'>
              रु {displayTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className='px-5 py-4'>
          <p className='mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-400'>
            Items Ordered
          </p>

          {isEditing ? (
            <div className='space-y-2'>
              {editItems.map((item) => (
                <div
                  key={item._id}
                  className='flex items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-2.5'
                >
                  <div className='flex items-center gap-2 min-w-0 text-sm text-orange-950 font-medium'>
                    <span className='text-base'>🍽️</span>
                    <span className='truncate'>{item.name}</span>
                    <span className='shrink-0 text-xs text-emerald-700 font-semibold'>
                      रु {Number(item.price).toFixed(0)} ea.
                    </span>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    <button
                      type='button'
                      onClick={() => changeItemQty(item._id, -1)}
                      disabled={item.quantity <= 1}
                      className='flex h-7 w-7 items-center justify-center rounded-full bg-orange-200 text-orange-900 font-bold hover:bg-orange-300 disabled:opacity-40 transition text-sm'
                    >
                      −
                    </button>
                    <span className='w-7 text-center text-sm font-black text-orange-950'>
                      {item.quantity}
                    </span>
                    <button
                      type='button'
                      onClick={() => changeItemQty(item._id, 1)}
                      className='flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition text-sm'
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className='flex gap-2 pt-1'>
                <button
                  type='button'
                  onClick={() => saveOrderEdits(order._id)}
                  disabled={savingOrder}
                  className='rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-60 transition'
                >
                  {savingOrder ? 'Saving…' : '✓ Save Changes'}
                </button>
                <button
                  type='button'
                  onClick={cancelEditing}
                  disabled={savingOrder}
                  className='rounded-xl border border-orange-200 bg-white px-5 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50 transition'
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className='flex flex-wrap gap-2'>
              {order.items?.map((item, idx) => (
                <span
                  key={idx}
                  className='inline-flex items-center gap-1.5 rounded-lg border border-orange-100 bg-orange-50/50 px-2.5 py-1 text-xs font-medium text-orange-950'
                >
                  🍽️ {item.name}
                  <span className='font-bold text-orange-700'>×{item.quantity}</span>
                  <span className='text-emerald-700'>(रु {Number(item.price).toFixed(0)})</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-orange-50 px-5 py-3'>
          <div className='flex flex-wrap gap-4 text-xs text-slate-500'>
            <span>
              📍 <span className='font-semibold text-slate-700'>{order.address || 'Address provided'}</span>
            </span>
            <span>
              💳 <span className='font-semibold text-slate-700 uppercase'>{order.payment_method || 'cash'}</span>
            </span>
          </div>

          {canEdit && !isEditing && (
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => startEditing(order)}
                className='inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition'
              >
                ✏️ Edit Quantities
              </button>
              <button
                type='button'
                onClick={() => handleUserCancel(order._id)}
                disabled={cancellingOrderId === order._id}
                className='inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60 transition'
              >
                {cancellingOrderId === order._id ? 'Cancelling…' : '✕ Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>

        {/* Page header */}
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Customer</p>
            <h1 className='mt-1 text-3xl font-black text-orange-950'>My Orders</h1>
            <p className='mt-1 text-sm text-orange-900/60'>
              Track, edit, or cancel your active orders
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              to='/profile'
              className='rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50'
            >
              ← Back to Profile
            </Link>
            <Link
              to='/menu'
              className='rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition'
            >
              + Order More
            </Link>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-r-transparent' />
            <p className='mt-4 text-sm font-semibold text-orange-900/60'>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className='rounded-3xl border border-orange-100 bg-white p-16 text-center shadow-sm'>
            <span className='text-6xl'>🍽️</span>
            <h3 className='mt-4 text-xl font-black text-orange-950'>No orders placed yet</h3>
            <p className='mt-2 text-sm text-orange-900/60 max-w-sm mx-auto'>
              Explore our delicious menu and place your first order!
            </p>
            <Link
              to='/menu'
              className='mt-6 inline-block rounded-full bg-orange-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-700 transition'
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Summary strip */}
            <div className='flex flex-wrap items-center gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-3 shadow-sm'>
              <span className='text-2xl font-black text-orange-600'>{orders.length}</span>
              <span className='text-sm text-orange-900/70 font-medium'>
                {orders.length === 1 ? 'order' : 'orders'} total
              </span>
              <span className='mx-2 text-orange-200'>|</span>
              <span className='text-sm font-semibold text-amber-700'>
                {orders.filter((o) => o.status === 'Pending').length} Pending
              </span>
              <span className='text-sm font-semibold text-blue-700'>
                · {orders.filter((o) => o.status === 'Preparing' || o.status === 'Packing').length} Preparing
              </span>
              <span className='text-sm font-semibold text-emerald-700'>
                · {deliveredOrders.length} Delivered
              </span>
            </div>

            {/* View filter buttons: Active (default) / Delivered / Cancelled */}
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => setView('active')}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  view === 'active'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50'
                }`}
              >
                Active Orders
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${
                  view === 'active' ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-700'
                }`}>
                  {activeOrders.length}
                </span>
              </button>

              <button
                type='button'
                onClick={() => setView('delivered')}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  view === 'delivered'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-green-700 border-green-200 hover:bg-green-50'
                }`}
              >
                ✓ Delivered
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${
                  view === 'delivered' ? 'bg-white/25 text-white' : 'bg-green-100 text-green-700'
                }`}>
                  {deliveredOrders.length}
                </span>
              </button>

              <button
                type='button'
                onClick={() => setView('cancelled')}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  view === 'cancelled'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                }`}
              >
                ✕ Cancelled
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${
                  view === 'cancelled' ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
                }`}>
                  {cancelledOrders.length}
                </span>
              </button>
            </div>

            {/* Section heading */}
            <div className='flex items-center gap-2 pt-1'>
              <h2 className='text-sm font-black uppercase tracking-wider text-orange-950'>
                {view === 'active'
                  ? 'Active Orders'
                  : view === 'delivered'
                    ? 'Completed Orders'
                    : 'Cancelled Orders'}
              </h2>
              <span className='text-xs text-orange-900/50'>
                ({visibleOrders.length})
              </span>
            </div>

            {/* Orders list */}
            {visibleOrders.length === 0 ? (
              <div className='rounded-2xl border border-dashed border-orange-200 bg-white/70 px-6 py-10 text-center'>
                <p className='text-sm font-semibold text-orange-900/70'>
                  {view === 'active'
                    ? 'No active orders right now. Your preparing/packing orders will appear here.'
                    : view === 'delivered'
                      ? 'You have no completed orders yet.'
                      : 'You have no cancelled orders.'}
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {visibleOrders.map(renderOrderCard)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders