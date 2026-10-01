import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import CartContext from './cartContext.js'

function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/cart', { withCredentials: true })
      if (response.data?.cart?.items) {
        setItems(response.data.cart.items.map((item) => ({ ...item, emoji: item.emoji || '🍽️' })))
      } else {
        setItems([])
      }
    } catch (error) {
      setItems([])
      if (error.response?.status !== 401) {
        console.error('Error fetching cart:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
    window.addEventListener('user-login', fetchCart)
    const handleLogout = () => setItems([])
    window.addEventListener('user-logout', handleLogout)

    return () => {
      window.removeEventListener('user-login', fetchCart)
      window.removeEventListener('user-logout', handleLogout)
    }
  }, [])

  const applyCart = (cart) => {
    if (!cart || !Array.isArray(cart.items)) {
      setItems([])
      return
    }
    setItems(cart.items.map((item) => ({ ...item, emoji: item.emoji || '🍽️' })))
  }

  async function addToCart(item) {
    const foodId = item.foodId || item._id
    if (!foodId) return

    try {
      const response = await axios.post('/api/cart/add', { foodId }, { withCredentials: true })
      applyCart(response.data?.cart)

      toast.success(response.data?.message || 'Added to cart!', {
        id: `cart-${foodId}`
      })
      return response.data?.cart
    } catch (error) {
      console.error('Error adding to backend cart:', error)
      if (error.response?.status === 401) {
        toast.error('Please log in to add items to your cart')
        navigate('/login')
      } else {
        toast.error(error.response?.data?.message || 'Failed to add item to cart')
      }
      throw error
    }
  }

  async function updateItem(foodId, amount) {
    const targetFoodId = String(foodId)
    try {
      let response
      if (amount > 0) {
        response = await axios.post('/api/cart/update', { foodId: targetFoodId, delta: 1 }, { withCredentials: true })
      } else {
        response = await axios.post('/api/cart/remove', { foodId: targetFoodId }, { withCredentials: true })
      }
      applyCart(response.data?.cart)
      return response.data?.cart
    } catch (error) {
      console.error('Error updating backend cart:', error)
      if (error.response?.status === 401) {
        toast.error('Please log in to manage your cart')
        navigate('/login')
      } else {
        toast.error(error.response?.data?.message || 'Failed to update item')
      }
      throw error
    }
  }

  async function clearCart() {
    try {
      await axios.delete('/api/cart/clear', { withCredentials: true })
    } catch (e) {
      console.error('Error clearing remote cart:', e)
    } finally {
      setItems([])
    }
  }

  const itemCount = items.length
  const total = items.reduce((sum, item) => {
    const price = Number(item.price)
    return sum + (Number.isFinite(price) ? price : 0) * (item.quantity || 1)
  }, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, updateItem, clearCart, fetchCart, itemCount, total, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartProvider }
