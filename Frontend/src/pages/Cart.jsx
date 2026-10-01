import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCart from '../context/useCart.js'
import axios from 'axios'

function Cart() {
  const [isOrdering, setIsOrdering] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('cash')
  const [userProfile, setUserProfile] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(null)

  const { items, updateItem, clearCart, itemCount, total, loading } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    window.scroll(0, 0)
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/profile', { withCredentials: true })
        if (response.data?.user) {
          setUserProfile(response.data.user)
          setDeliveryAddress(response.data.user.address || '')
          setContactPhone(response.data.user.phone || '')
        }
      } catch {
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  const handleOpenPaymentModal = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address')
      return
    }

    if (!contactPhone.trim()) {
      toast.error('Please enter a contact phone number')
      return
    }

    setShowPaymentModal(true)
  }
  const handleKhaltiPayment = async (orderId) => {
    const payload = {
      amount: total,
      items: items.map(({ name, quantity }) => ({ name, quantity: quantity || 1 })),
    }

    try {
      const response = await axios.post("/api/payment/khalti/initiate", payload, {
        withCredentials: true
      })
      
      const paymentUrl = response.data?.payment_url || response.data?.paymentUrl || response.data?.payment?.paymentUrl
      const pidx = response.data?.pidx || response.data?.payment?.pidx || orderId; // Fallback to orderId if no pidx

      if (paymentUrl) {
        // Save payment details to DB before redirecting
        try {
          await axios.post('/api/payment/save', {
            payment_method: 'khalti',
            pidx: pidx,
            total_amount: total,
            user_id: userProfile?._id
          }, { withCredentials: true });
        } catch (saveErr) {
          console.error("Error saving Khalti payment info:", saveErr);
        }

        clearCart()
        setShowPaymentModal(false)
        window.location.href = paymentUrl
      } else {
        toast.error(response.data?.message || "Khalti payment URL not received")
      }
    } catch (error) {
      console.error("Khalti payment error:", error)
      toast.error(error.response?.data?.message || "Failed to connect to Khalti payment gateway")
    }
  }

  const handleConfirmOrder = async (methodToUse = selectedPayment) => {
    setIsOrdering(true)

    try {
      if (methodToUse === 'khalti') {
        const orderRes = await axios.post('/api/orders/create', {
          payment_method: 'khalti',
          address: deliveryAddress,
          phone: contactPhone,
          name: userProfile?.name
        }, { withCredentials: true })

        await handleKhaltiPayment(orderRes.data?.order?.order_id || `KHALTI-${Date.now()}`)
        return
      }

      if (methodToUse === 'esewa') {
        const orderRes = await axios.post('/api/orders/create', {
          payment_method: 'esewa',
          address: deliveryAddress,
          phone: contactPhone,
          name: userProfile?.name
        }, { withCredentials: true })
        
        const orderId = orderRes.data?.order?.order_id || `ESEWA-${Date.now()}`;

        const { data: payment } = await axios.post('/api/payments/esewa/initiate', {
          totalAmount: total,
          items: items.map(({ name, quantity }) => ({ name, quantity: quantity || 1 })),
        }, { withCredentials: true }).catch(err => {
            console.error("eSewa error, proceeding to save locally if endpoint is missing", err);
            return { data: null };
        });

        if (payment && payment.paymentUrl) {
          try {
            await axios.post('/api/payment/save', {
              payment_method: 'esewa',
              pidx: orderId, // using orderId since eSewa doesn't have pidx
              total_amount: total,
              user_id: userProfile?._id
            }, { withCredentials: true });
          } catch (saveErr) {
            console.error("Error saving eSewa payment info:", saveErr);
          }

          clearCart()
          setShowPaymentModal(false)
          const form = document.createElement('form')
          form.method = 'POST'
          form.action = payment.paymentUrl
          Object.entries(payment.fields).forEach(([name, value]) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = name
            input.value = value
            form.appendChild(input)
          })
          document.body.appendChild(form)
          form.submit()
          return
        } else {
           // fallback if esewa endpoint is not completely implemented
           toast.error('eSewa integration is currently unavailable')
           setIsOrdering(false)
           return
        }
      }

      const response = await axios.post('/api/orders/create', {
        payment_method: methodToUse,
        address: deliveryAddress,
        phone: contactPhone,
        name: userProfile?.name
      }, { withCredentials: true })

      if (response.data?.success) {
        const order = response.data.order;
        
        // Save payment info for COD
        try {
          await axios.post('/api/payment/save', {
            payment_method: methodToUse,
            pidx: order.order_id || `COD-${Date.now()}`,
            total_amount: total,
            user_id: userProfile?._id
          }, { withCredentials: true });
        } catch (saveErr) {
          console.error("Error saving cash payment info:", saveErr);
        }

        setOrderSuccess(order)
        clearCart()
        setShowPaymentModal(false)
        toast.success(`🎉 Order placed successfully! Paid via ${methodToUse.toUpperCase()}.`)
      } else {
        toast.error(response.data?.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Order error:', error)
      toast.error(error.response?.data?.message || error.message || 'Unable to place your order.')
    } finally {
      setIsOrdering(false)
    }
  }

  if (orderSuccess) {
    return (
      <main className='min-h-[calc(100vh-76px)] bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 px-5 py-16 text-orange-950 lg:px-8'>
        <section className='mx-auto max-w-2xl rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-xl sm:p-12'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl shadow-inner'>
            ✓
          </div>
          <span className='mt-6 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700'>
            Order Confirmed
          </span>
          <h1 className='mt-3 text-3xl font-black sm:text-4xl text-orange-950'>Your feast is on its way!</h1>
          <p className='mt-3 text-sm text-orange-900/70'>
            Thank you for ordering with Bhoj Express. Your order has been placed into our system and sent to the kitchen.
          </p>

          <div className='mt-8 rounded-2xl bg-orange-50/80 p-5 text-left border border-orange-100'>
            <div className='flex justify-between items-center border-b border-orange-200/60 pb-3'>
              <span className='text-xs font-bold uppercase text-orange-600'>Order Reference</span>
              <span className='font-mono font-black text-sm text-orange-950'>#{orderSuccess.order_id || orderSuccess._id?.slice(-6).toUpperCase()}</span>
            </div>
            <div className='mt-3 space-y-1.5 text-xs text-orange-900'>
              <div className='flex justify-between'>
                <span className='text-orange-950/60'>Status:</span>
                <span className='font-bold text-amber-600 uppercase'>{orderSuccess.status || 'Pending'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-orange-950/60'>Delivery to:</span>
                <span className='font-semibold'>{orderSuccess.address || deliveryAddress}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-orange-950/60'>Payment:</span>
                <span className='font-semibold uppercase'>{orderSuccess.payment_method || 'Cash'}</span>
              </div>
              <div className='flex justify-between pt-2 border-t border-orange-200/60 text-sm font-black'>
                <span>Total Amount:</span>
                <span className='text-emerald-600'>रु {Number(orderSuccess.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className='mt-8 flex flex-col sm:flex-row gap-3 justify-center'>
            <Link
              to='/profile'
              className='rounded-full bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-700 transition'
            >
              View Order in Profile →
            </Link>
            <Link
              to='/menu'
              className='rounded-full border border-orange-300 bg-white px-7 py-3.5 text-sm font-bold text-orange-800 hover:bg-orange-50 transition'
            >
              Browse More Food
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className='min-h-[calc(100vh-76px)] bg-orange-50 px-5 py-10 text-orange-950 lg:px-8'>
      <section className='mx-auto max-w-5xl'>
        <div className='flex flex-col justify-between gap-4 border-b border-orange-200 pb-6 sm:flex-row sm:items-end'>
          <div>
            <p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-600'>Your cart</p>
            <h1 className='mt-2 text-4xl font-black tracking-tight sm:text-5xl'>Ready when you are.</h1>
          </div>
          <span className='rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm'>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className='py-20 text-center'>
            <span className='text-7xl' role='img' aria-label='Empty plate'>🍽️</span>
            <h2 className='mt-8 text-3xl font-black'>Your table is waiting.</h2>
            <p className='mx-auto mt-4 max-w-lg leading-7 text-orange-950/60'>
              Your cart is empty right now. Discover your favorite dishes and we will bring them hot and fresh to your doorstep.
            </p>
            <Link
              to='/menu'
              className='mt-8 inline-block rounded-full bg-orange-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-orange-700 shadow-md transition'
            >
              Browse the menu →
            </Link>
          </div>
        ) : (
          <div className='mt-6 grid gap-8 lg:grid-cols-[1fr_360px]'>
            {/* Cart Items List */}
            <div className='grid content-start gap-4'>
              {items.map((item) => {
                const itemId = item.foodId || item._id
                return (
                  <article
                    key={String(itemId)}
                    className='flex items-center gap-4 rounded-3xl border border-orange-200 bg-white p-4 shadow-sm hover:shadow-md transition sm:p-5'
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className='h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-orange-200'
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span
                      style={{ display: item.image ? 'none' : 'flex' }}
                      className='h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-200 to-amber-300 text-4xl'
                      role='img'
                      aria-label={item.name}
                    >
                      {item.emoji || '🍽️'}
                    </span>

                    <div className='min-w-0 flex-1'>
                      <h2 className='truncate text-lg font-black text-orange-950'>{item.name}</h2>
                      <p className='mt-1 text-sm font-semibold text-emerald-600'>
                        रु {Number(item.price).toFixed(2)} each
                      </p>
                    </div>

                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        onClick={() => updateItem(itemId, -1)}
                        className='flex h-9 w-9 items-center justify-center rounded-full border border-orange-300 font-bold text-orange-700 hover:bg-orange-100 transition'
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                      <span className='w-6 text-center font-black text-orange-950'>
                        {item.quantity || 1}
                      </span>
                      <button
                        type='button'
                        onClick={() => updateItem(itemId, 1)}
                        className='flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 font-bold text-white hover:bg-orange-700 shadow-sm transition'
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Checkout & Order Aside — warm cream palette */}
            <aside className='h-fit rounded-3xl border border-orange-200 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 p-6 text-orange-950 shadow-lg'>
              <p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-500'>
                Order summary
              </p>

              {/* Delivery Info */}
              <div className='mt-5 space-y-3 rounded-2xl bg-white/70 p-4 border border-orange-200/80 shadow-sm backdrop-blur-sm'>
                <label className='block text-xs font-bold uppercase tracking-wider text-orange-700'>
                  Delivery Address:
                  <input
                    type='text'
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder='Enter your delivery location'
                    className='mt-1.5 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs font-medium text-orange-950 placeholder-orange-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition'
                  />
                </label>

                <label className='block text-xs font-bold uppercase tracking-wider text-orange-700'>
                  Phone Number:
                  <input
                    type='text'
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder='Contact phone for delivery rider'
                    className='mt-1.5 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs font-medium text-orange-950 placeholder-orange-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition'
                  />
                </label>
              </div>

              {/* Totals */}
              <div className='mt-6 border-t border-orange-200 pt-4 space-y-2 text-sm text-orange-700'>
                <div className='flex justify-between'>
                  <span>Items count</span>
                  <span className='font-bold text-orange-950'>{itemCount} items</span>
                </div>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='font-bold text-orange-950'>रु {total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery Charge</span>
                  <span className='font-bold text-emerald-600'>FREE</span>
                </div>
              </div>

              <div className='mt-5 border-t border-orange-200 pt-4 flex items-center justify-between'>
                <span className='text-base font-bold text-orange-950'>Grand Total</span>
                <span className='text-2xl font-black text-orange-600'>
                  रु {total.toFixed(2)}
                </span>
              </div>

              {/* Order Button */}
              <button
                type='button'
                onClick={handleOpenPaymentModal}
                disabled={isOrdering || items.length === 0}
                className='mt-6 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-orange-300/50 hover:from-orange-600 hover:to-amber-600 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
              >
                🛍️ Place Order Now
              </button>

              <p className='mt-3 text-center text-xs text-orange-500'>
                Instant confirmation • Direct kitchen dispatch
              </p>
            </aside>
          </div>
        )}
      </section>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='relative w-full max-w-lg overflow-hidden rounded-3xl border border-orange-200 bg-white p-6 shadow-2xl sm:p-8 text-orange-950'>
            {/* Modal Close Button */}
            <button
              type='button'
              onClick={() => setShowPaymentModal(false)}
              disabled={isOrdering}
              className='absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition font-bold'
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className='flex items-center gap-3 border-b border-orange-100 pb-4'>
              <img
                src='/images/bhojExpress.jpg'
                alt='Bhoj Express'
                className='h-12 w-12 rounded-2xl object-cover shadow-sm ring-2 ring-orange-200'
              />
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-600'>Bhoj Express Checkout</p>
                <h3 className='text-xl font-black text-orange-950'>Select Payment Method</h3>
              </div>
            </div>

            {/* Summary Banner */}
            <div className='mt-4 rounded-2xl bg-orange-50 p-4 border border-orange-100 flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-orange-950/60'>Grand Total</p>
                <p className='text-2xl font-black text-orange-600'>रु {total.toFixed(2)}</p>
              </div>
              <div className='text-right max-w-[200px]'>
                <p className='text-xs font-medium text-orange-950/60 truncate'>Deliver to: {deliveryAddress}</p>
                <p className='text-xs font-semibold text-orange-950 truncate'>📞 {contactPhone}</p>
              </div>
            </div>

            {/* Payment Options */}
            <div className='mt-5 space-y-3'>
              {/* Cash on Delivery */}
              <div
                onClick={() => setSelectedPayment('cash')}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-200 ${
                  selectedPayment === 'cash'
                    ? 'border-amber-500 bg-amber-50/90 shadow-md ring-2 ring-amber-200'
                    : 'border-orange-100 bg-white hover:border-amber-300 hover:bg-amber-50/40'
                }`}
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-2xl shadow-inner'>
                    💵
                  </div>
                  <div>
                    <h4 className='text-base font-bold text-orange-950'>Cash on Delivery</h4>
                    <p className='text-xs text-orange-950/60'>Pay cash when your food arrives at your door</p>
                  </div>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                  selectedPayment === 'cash' ? 'border-amber-600 bg-amber-600 text-white' : 'border-orange-300'
                }`}>
                  {selectedPayment === 'cash' && <span className='text-xs font-bold'>✓</span>}
                </div>
              </div>

              {/* eSewa */}
              <div
                onClick={() => setSelectedPayment('esewa')}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-200 ${
                  selectedPayment === 'esewa'
                    ? 'border-emerald-500 bg-emerald-50/90 shadow-md ring-2 ring-emerald-200'
                    : 'border-orange-100 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-white p-1 shadow-sm'>
                    <img src='/images/esewa.jpg' alt='eSewa' className='h-full w-full object-contain rounded-lg' />
                  </div>
                  <div>
                    <h4 className='text-base font-bold text-emerald-950'>eSewa Wallet</h4>
                    <p className='text-xs text-emerald-900/60'>Pay instantly & securely via eSewa</p>
                  </div>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                  selectedPayment === 'esewa' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-orange-300'
                }`}>
                  {selectedPayment === 'esewa' && <span className='text-xs font-bold'>✓</span>}
                </div>
              </div>

              {/* Khalti */}
              <div
                onClick={() => setSelectedPayment('khalti')}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all duration-200 ${
                  selectedPayment === 'khalti'
                    ? 'border-purple-600 bg-purple-50/90 shadow-md ring-2 ring-purple-200'
                    : 'border-orange-100 bg-white hover:border-purple-300 hover:bg-purple-50/40'
                }`}
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-purple-200 bg-white p-1 shadow-sm'>
                    <img src='/images/khalti.png' alt='Khalti' className='h-full w-full object-contain rounded-lg' />
                  </div>
                  <div>
                    <h4 className='text-base font-bold text-purple-950'>Khalti Wallet</h4>
                    <p className='text-xs text-purple-900/60'>Pay securely using your Khalti account</p>
                  </div>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                  selectedPayment === 'khalti' ? 'border-purple-600 bg-purple-600 text-white' : 'border-orange-300'
                }`}>
                  {selectedPayment === 'khalti' && <span className='text-xs font-bold'>✓</span>}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className='mt-6 flex items-center justify-end gap-3 border-t border-orange-100 pt-5'>
              <button
                type='button'
                onClick={() => setShowPaymentModal(false)}
                disabled={isOrdering}
                className='rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-50 transition'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => handleConfirmOrder(selectedPayment)}
                disabled={isOrdering}
                className={`rounded-full px-6 py-2.5 text-sm font-black text-white shadow-md transition hover:brightness-110 disabled:opacity-60 ${
                  selectedPayment === 'esewa'
                    ? 'bg-emerald-600 shadow-emerald-200'
                    : selectedPayment === 'khalti'
                    ? 'bg-purple-600 shadow-purple-200'
                    : 'bg-orange-600 shadow-orange-200'
                }`}
              >
                {isOrdering ? (
                  'Processing Order...'
                ) : selectedPayment === 'esewa' ? (
                  'Pay with eSewa →'
                ) : selectedPayment === 'khalti' ? (
                  'Pay with Khalti →'
                ) : (
                  'Confirm & Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Cart