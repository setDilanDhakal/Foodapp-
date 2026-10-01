import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useCart from '../context/useCart.js'

function FoodDetails() {
  const location = useLocation()
  const food = location.state?.food
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  // If no food was passed in (e.g. user refreshed the page),
  // fall back to a friendly "not found" screen.
  if (!food) {
    return (
      <main className='min-h-screen bg-orange-50 px-5 py-16 text-orange-950 lg:px-8'>
        <div className='mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-10 text-center shadow-sm'>
          <p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-600'>
            Dish not found
          </p>
          <h1 className='mt-4 text-3xl font-black'>
            This item is not on the menu.
          </h1>
          <Link
            to='/menu'
            className='mt-6 inline-block rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700'
          >
            Back to menu
          </Link>
        </div>
      </main>
    )
  }

  const name = food.name
  const price = `रु ${food.price.toLocaleString()}`
  const details = food.description

  const handleAddToCart = async () => {
    try {
      await addToCart({ foodId: food._id })
      setIsAdded(true)
      window.setTimeout(() => setIsAdded(false), 1200)
    } catch {
      // CartContext handles authentication redirects. Do not show a false success state.
    }
  }

  return (
    <main className='min-h-screen bg-orange-50 px-5 py-10 text-orange-950 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <Link
          to='/menu'
          className='mb-5 inline-flex items-center gap-2 text-sm font-bold text-orange-700 hover:text-orange-900'
        >
          ← Back to menu
        </Link>

        <div className='overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-[0_10px_40px_rgba(251,146,60,0.10)]'>
          <div className='grid gap-0 md:grid-cols-[0.85fr_1fr]'>
            {/* LEFT — image */}
            <div className='relative aspect-square overflow-hidden bg-gradient-to-br from-orange-200 via-amber-300 to-yellow-200'>
              <img
                src={food.image}
                className='h-full w-full object-cover'
                alt={name}
              />
              <span className='absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700 shadow-sm backdrop-blur'>
                {food.category || 'Best seller'}
              </span>
            </div>

            {/* RIGHT — info */}
            <div className='flex flex-col p-5 sm:p-6'>
              <p className='text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600'>
                Signature dish
              </p>
              <h1 className='mt-1.5 text-2xl font-black leading-tight sm:text-3xl'>
                {name}
              </h1>

              <div className='mt-3 flex items-center gap-3'>
                <span className='rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700'>
                  {food.category || 'Best seller'}
                </span>
                <span className='text-xl font-black text-emerald-600'>
                  {price}
                </span>
              </div>

              {/* Description — shown once */}
              <p className='mt-4 text-sm leading-6 text-orange-950/70'>
                {details}
              </p>

              {/* Quick facts */}
              <div className='mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide'>
                <span className='rounded-full bg-orange-50 px-2.5 py-1 text-orange-700'>
                  ⏱️ {food.preparationTime || '30 min'}
                </span>
                <span className='rounded-full bg-orange-50 px-2.5 py-1 text-orange-700'>
                  🌿 Fresh
                </span>
                <span className='rounded-full bg-orange-50 px-2.5 py-1 text-orange-700'>
                  🔥 Hot
                </span>
              </div>

              <div className='mt-6 flex flex-wrap gap-2.5'>
                <button
                  type='button'
                  onClick={handleAddToCart}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold text-white transition ${
                    isAdded ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {isAdded ? 'Added ✓' : 'Add to order'}
                </button>
                <button
                  type='button'
                  className='rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50'
                >
                  ♡ Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default FoodDetails
