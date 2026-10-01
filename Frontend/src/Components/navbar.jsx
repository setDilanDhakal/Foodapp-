import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import useCart from '../context/useCart.js'

const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Offers', href: '/offers' },
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const profileRef = useRef(null)

  const isAdmin = currentUser?.role === 'admin'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsProfileOpen(false)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('api/users/profile', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        })
        setCurrentUser(response.data.user)
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Error fetching user profile:', error)
        }
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const handleUserLogin = (event) => {
      setCurrentUser(event.detail)
    }

    window.addEventListener('user-login', handleUserLogin)

    return () => {
      window.removeEventListener('user-login', handleUserLogin)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post(
        'api/users/logout',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      setCurrentUser(null)
      setIsProfileOpen(false)
      setIsMenuOpen(false)
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out. Please try again.')
    }
  }

  const goTo = (path) => {
    setIsProfileOpen(false)
    setIsMenuOpen(false)
    navigate(path)
  }

  return (
    <header className='sticky top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur'>
      <nav
        className='mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8'
        aria-label='Main navigation'
      >
        <Link to='/' className='flex items-center gap-3' aria-label='Bhoj Express home'>
          <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-orange-100'>
            <img
              src='images/bhojExpress.jpg'
              alt='Bhoj Express logo'
              className='h-full w-full rounded-full object-contain'
            />
          </div>
          <span className='text-xl font-bold tracking-tight text-orange-600'>Bhoj Express</span>
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          {navigationLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-orange-600 ${isActive ? 'text-orange-600' : 'text-slate-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className='hidden items-center gap-3 md:flex'>
          <Link
            to='/cart'
            className='rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-600'
          >
            Cart <sup> {itemCount}</sup>
          </Link>
          {currentUser ? (
            <div className='relative' ref={profileRef}>
              {/* Avatar-only trigger. Softens its ring when the dropdown is open. */}
              <button
                type='button'
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-expanded={isProfileOpen}
                aria-haspopup='true'
                aria-label='Open profile menu'
                className={`block h-10 w-10 shrink-0 overflow-hidden rounded-full transition-all duration-200 focus:outline-none ${
                  isProfileOpen
                    ? 'ring-2 ring-amber-200'
                    : 'ring-2 ring-orange-100 hover:ring-amber-200 focus:ring-orange-400'
                }`}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span
                  className={`h-full w-full items-center justify-center text-sm font-bold text-white ${
                    isProfileOpen
                      ? 'bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400'
                      : 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500'
                  }`}
                  style={{ display: currentUser.avatar ? 'none' : 'flex' }}
                >
                  {currentUser.name?.charAt(0)?.toUpperCase()}
                </span>
              </button>

              {isProfileOpen && (
                <div className='absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-3xl border border-orange-100/80 bg-white/95 p-3 shadow-2xl shadow-orange-950/15 backdrop-blur-xl'>
                  {/* Profile Header */}
                  <div className='relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 p-4 text-white'>
                    <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10' />
                    <div className='absolute -bottom-10 -left-5 h-20 w-20 rounded-full bg-white/10' />

                    <div className='relative flex items-center gap-3'>
                      {/* Dropdown header avatar */}
                      <div className='relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-lg font-extrabold text-orange-600 shadow-lg ring-4 ring-white/20'>
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className='h-full w-full object-cover'
                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }}
                          />
                        ) : null}
                        <span
                          className='absolute inset-0 flex items-center justify-center'
                          style={{ display: currentUser.avatar ? 'none' : 'flex' }}
                        >
                          {currentUser.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>

                      <div className='min-w-0'>
                        <p className='truncate text-base font-bold'>{currentUser.name}</p>
                        <p className='truncate text-xs text-white/75'>{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className='space-y-2 py-1'>
                    {isAdmin ? (
                      <button
                        onClick={() => goTo('/admin/dashboard')}
                        className='group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left transition-all duration-200 hover:border-orange-100 hover:bg-orange-50 active:scale-[0.98]'
                      >
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-all duration-200 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth='1.8'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M3 13.5h18M3 9.75h18M4.5 5.25h15A1.5 1.5 0 0121 6.75v10.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.25V6.75a1.5 1.5 0 011.5-1.5z'
                            />
                          </svg>
                        </div>

                        <div className='flex-1'>
                          <p className='text-sm font-bold text-gray-800 group-hover:text-orange-600'>
                            Dashboard
                          </p>
                          <p className='text-xs text-gray-400'>Manage your restaurant</p>
                        </div>

                        <span className='text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500'>
                          ›
                        </span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => goTo('/profile')}
                          className='group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left transition-all duration-200 hover:border-orange-100 hover:bg-orange-50 active:scale-[0.98]'
                        >
                          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-all duration-200 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              strokeWidth='1.8'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0'
                              />
                            </svg>
                          </div>

                          <div className='flex-1'>
                            <p className='text-sm font-bold text-gray-800 group-hover:text-orange-600'>
                              My Profile
                            </p>
                            <p className='text-xs text-gray-400'>View and edit your profile</p>
                          </div>

                          <span className='text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500'>
                            ›
                          </span>
                        </button>

                        <button
                          onClick={() => goTo('/my-orders')}
                          className='group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left transition-all duration-200 hover:border-orange-100 hover:bg-orange-50 active:scale-[0.98]'
                        >
                          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-all duration-200 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              strokeWidth='1.8'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 5h13M9 21h.01M18 21h.01'
                              />
                            </svg>
                          </div>

                          <div className='flex-1'>
                            <p className='text-sm font-bold text-gray-800 group-hover:text-orange-600'>
                              Orders
                            </p>
                            <p className='text-xs text-gray-400'>
                              View your orders and purchases
                            </p>
                          </div>

                          <span className='text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500'>
                            ›
                          </span>
                        </button>
                      </>
                    )}

                    {/* Change Password - routes differently for admin vs user */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        navigate(isAdmin ? '/admin/settings/changepassword' : '/change-password')
                      }}
                      className='group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left transition-all duration-200 hover:border-orange-100 hover:bg-orange-50 active:scale-[0.98]'
                    >
                      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-all duration-200 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth='1.8'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
                          />
                        </svg>
                      </div>

                      <div className='flex-1'>
                        <p className='text-sm font-bold text-gray-800 group-hover:text-orange-600'>
                          Change Password
                        </p>
                        <p className='text-xs text-gray-400'>Update your account password</p>
                      </div>

                      <span className='text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500'>
                        ›
                      </span>
                    </button>

                  </div>

                  {/* Logout */}
                  <div className='mt-3 border-t border-gray-100 pt-3'>
                    <button
                      type='button'
                      onClick={handleLogout}
                      className='group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-200 hover:bg-red-50 active:scale-[0.98]'
                    >
                      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all duration-200 group-hover:bg-red-500 group-hover:text-white'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth='1.8'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 12h9m0 0l-3-3m3 3l-3 3'
                          />
                        </svg>
                      </div>

                      <span className='text-sm font-bold text-red-500 group-hover:text-red-600'>
                        Log out
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to='/login'
              className='rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700'
            >
              Login
            </Link>
          )}
        </div>

        <button
          type='button'
          className='rounded-lg p-2 text-slate-700 hover:bg-orange-50 md:hidden'
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className='block h-0.5 w-6 bg-current' />
          <span className='mt-1.5 block h-0.5 w-6 bg-current' />
          <span className='mt-1.5 block h-0.5 w-6 bg-current' />
        </button>
      </nav>

      {isMenuOpen && (
        <div className='border-t border-orange-100 bg-white px-5 pb-4 md:hidden'>
          <div className='flex flex-col gap-1 pt-2'>
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className='rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to='/cart'
              onClick={() => setIsMenuOpen(false)}
              className='rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600'
            >
              Cart ({itemCount})
            </Link>
            {currentUser ? (
              <>
                {/* Mobile profile toggle — avatar only, softens when open */}
                <button
                  type='button'
                  onClick={() => setIsProfileOpen((open) => !open)}
                  aria-label='Open profile menu'
                  className='mt-1 flex items-center justify-between gap-3 rounded-xl px-1 py-2 text-left'
                >
                  <div
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white shadow transition-all duration-200 ${
                      isProfileOpen
                        ? 'bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400 ring-2 ring-amber-200'
                        : 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 ring-2 ring-white'
                    }`}
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className='h-full w-full object-cover'
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }}
                      />
                    ) : null}
                    <span
                      className='absolute inset-0 flex items-center justify-center'
                      style={{ display: currentUser.avatar ? 'none' : 'flex' }}
                    >
                      {currentUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className='rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm space-y-1'>
                    {isAdmin ? (
                      <button
                        type='button'
                        onClick={() => goTo('/admin/dashboard')}
                        className='block w-full rounded-lg bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-700'
                      >
                        Dashboard
                      </button>
                    ) : (
                      <>
                        <button type='button' onClick={() => goTo('/profile')} className='block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-orange-700 hover:bg-orange-100'>My Profile</button>
                        <button type='button' onClick={() => goTo('/my-orders')} className='block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-orange-700 hover:bg-orange-100'>My Orders</button>
                      </>
                    )}
                    <button
                      type='button'
                      onClick={handleLogout}
                      className='block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50'
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to='/login'
                onClick={() => setIsMenuOpen(false)}
                className='mt-1 rounded-lg bg-orange-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-700'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar