import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Order', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/users' },
]

const settingsItems = [
  { label: 'Edit profile', to: '/admin/settings/editprofile' },
  { label: 'Create admin', to: '/admin/administrators/add' },
  { label: 'Change password', to: '/admin/settings/changepassword' },
]

function AdminLayout() {
  const sidebarRef = useRef(null)
  const mainRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [lastLogin, setLastLogin] = useState(() => localStorage.getItem('adminLastLogin'))
  const profileRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/profile', { withCredentials: true })
        if (response.data.user?.role !== 'admin') {
          navigate('/')
          return
        }
        setCurrentUser(response.data.user)
        setIsAuthorized(true)
      } catch {
        navigate('/')
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [navigate])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      localStorage.setItem('adminLastLogin', new Date().toISOString())
      await axios.post('api/users/logout', {}, { withCredentials: true })
      toast.success('Logged out successfully', { id: 'logout-success' })
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out', { id: 'logout-error' })
    }
  }

  const [isProductsOpen, setIsProductsOpen] = useState(
    location.pathname.startsWith('/admin/products') || location.pathname === '/admin/categories'
  )
  const isProductsActive =
    location.pathname.startsWith('/admin/products') || location.pathname === '/admin/categories'

  const isSettingsActive =
    location.pathname.startsWith('/admin/settings') ||
    location.pathname.startsWith('/admin/administrators')

  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive)

  const userInitials =
    currentUser?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AD'

  const [prevIsActive, setPrevIsActive] = useState(isProductsActive)
  if (prevIsActive !== isProductsActive) {
    setPrevIsActive(isProductsActive)
    if (!isProductsActive) setIsProductsOpen(false)
  }

  const [prevSettingsActive, setPrevSettingsActive] = useState(isSettingsActive)
  if (prevSettingsActive !== isSettingsActive) {
    setPrevSettingsActive(isSettingsActive)
    if (!isSettingsActive) setIsSettingsOpen(false)
  }

  const handoffScroll = (event, sourceRef, targetRef) => {
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target || event.deltaY === 0) return

    const atTop = source.scrollTop <= 0 && event.deltaY < 0
    const atBottom =
      source.scrollTop + source.clientHeight >= source.scrollHeight - 1 && event.deltaY > 0
    if ((atTop || atBottom) && target.scrollHeight > target.clientHeight) {
      event.preventDefault()
      target.scrollTop += event.deltaY
    }
  }

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Not available'
    const then = new Date(dateString).getTime()
    if (Number.isNaN(then)) return 'Not available'

    const diffMs = Date.now() - then
    const diffSec = Math.floor(diffMs / 1000)

    if (diffSec < 30) return 'just now'
    if (diffSec < 60) return `${diffSec} sec ago`

    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} min ago`

    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr} hr ago`

    const diffDay = Math.floor(diffHr / 24)
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`

    const diffMonth = Math.floor(diffDay / 30)
    if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`

    const diffYear = Math.floor(diffMonth / 12)
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
  }

  if (isCheckingAuth || !isAuthorized) return null

  return (
    <div className='min-h-screen bg-orange-50 text-orange-950 lg:h-screen lg:overflow-hidden'>
      <div className='mx-auto flex min-h-screen max-w-[1600px] lg:h-screen'>

        {/* admin left side */}
        <aside
          ref={sidebarRef}
          onWheel={(event) => handoffScroll(event, sidebarRef, mainRef)}
          className='hidden w-72 shrink-0 flex-col overflow-y-auto bg-[#2b1d1a] p-6 text-white lg:flex'
        >
          <div className='flex items-center gap-3 border-b border-white/10 pb-5'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl'>
              <img
                src='/images/bhojExpress.jpg'
                alt='Bhoj Express Logo'
                className='h-full w-full rounded-xl'
              />
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-orange-200'>Admin</p>
              <h1 className='text-xl font-black'>Bhoj Express</h1>
            </div>
          </div>

          <nav className='mt-8 mb-8 space-y-2'>
            {navItems.map((item) =>
              item.label === 'Products' ? (
                <div key={item.to}>
                  <button
                    type='button'
                    onClick={() => setIsProductsOpen((open) => !open)}
                    aria-expanded={isProductsOpen}
                    aria-controls='admin-product-links'
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${isProductsActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-orange-100/80 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden='true' className={`text-lg leading-none transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>
                  <div
                    id='admin-product-links'
                    className={`grid overflow-hidden transition-all duration-300 ${isProductsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className='min-h-0 space-y-1 pl-4 pt-1'>
                      <NavLink to='/admin/products' end className={({ isActive }) => `block rounded-lg border-l-2 px-4 py-2 text-xs font-semibold transition-all duration-300 ${isActive ? 'border-orange-300 bg-white/10 text-orange-100 shadow-sm shadow-white/5 translate-x-1' : 'border-transparent text-orange-100/70 hover:bg-white/5 hover:text-white'}`}>All products</NavLink>
                      <NavLink to='/admin/products/add' className={({ isActive }) => `block rounded-lg border-l-2 px-4 py-2 text-xs font-semibold transition-all duration-300 ${isActive ? 'border-orange-300 bg-white/10 text-orange-100 shadow-sm shadow-white/5 translate-x-1' : 'border-transparent text-orange-100/70 hover:bg-white/5 hover:text-white'}`}>Add product</NavLink>
                      <NavLink to='/admin/categories' className={({ isActive }) => `block rounded-lg border-l-2 px-4 py-2 text-xs font-semibold transition-all duration-300 ${isActive ? 'border-orange-300 bg-white/10 text-orange-100 shadow-sm shadow-white/5 translate-x-1' : 'border-transparent text-orange-100/70 hover:bg-white/5 hover:text-white'}`}>Manage categories</NavLink>
                      <span className='block px-4 py-2 text-xs font-semibold text-orange-100/45'>Edit from product row</span>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-orange-100/80 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              )
            )}

            {/* ⚙️ Settings dropdown */}
            <div>
              <button
                type='button'
                onClick={() => setIsSettingsOpen((open) => !open)}
                aria-expanded={isSettingsOpen}
                aria-controls='admin-settings-links'
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${isSettingsActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-orange-100/80 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span>Settings</span>
                <span aria-hidden='true' className={`text-lg leading-none transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}>⌄</span>
              </button>
              <div
                id='admin-settings-links'
                className={`grid overflow-hidden transition-all duration-300 ${isSettingsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
              >
                <div className='min-h-0 space-y-1 pl-4 pt-1'>
                  {settingsItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block rounded-lg border-l-2 px-4 py-2 text-xs font-semibold transition-all duration-300 ${isActive
                          ? 'border-orange-300 bg-white/10 text-orange-100 shadow-sm shadow-white/5 translate-x-1'
                          : 'border-transparent text-orange-100/70 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className='mt-auto rounded-2xl border border-white/10 bg-white/5 p-4'>
            <p className='text-xs uppercase tracking-[0.2em] text-orange-200'>Signed in as</p>
            <div className='mt-3 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 overflow-hidden'>
                {(currentUser?.image || currentUser?.avatar) ? (
                  <img src={currentUser.image || currentUser.avatar} alt='Profile' className='h-full w-full object-cover' />
                ) : (
                  <img src='/images/bhojExpress.jpg' alt='Profile' className='h-full w-full object-cover' />
                )}
              </div>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-white'>{currentUser?.name || 'Loading profile...'}</p>
                <p className='truncate text-xs text-orange-100/70'>{currentUser?.email || ''}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Admin Top Section */}
        <main
          ref={mainRef}
          onWheel={(event) => handoffScroll(event, mainRef, sidebarRef)}
          className='min-w-0 flex-1 overflow-y-auto'
        >
          <header className='sticky top-0 border-b border-orange-200 bg-white px-4 py-5 backdrop-blur-sm sm:px-6 lg:px-8'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center'>
                <div className='mr-4'>
                  <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Operations dashboard</p>
                  <h2 className='mt-1 text-2xl font-black text-orange-950'>Admin Panel</h2>
                </div>

                <div>
                  <button type='button' onClick={() => navigate('/admin/products')} className='rounded-full mr-2 border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100'>All Products</button>
                  <button type='button' onClick={() => navigate('/admin/orders')} className='rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100'>Order</button>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='hidden items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 shadow-sm sm:flex'>
                  <span className='relative flex h-2 w-2'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                    <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500'></span>
                  </span>
                  <span className='font-mono text-sm font-black tabular-nums text-orange-950'>{formatTime(currentTime)}</span>
                </div>

                <div className='hidden items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 shadow-sm sm:flex'>
                  <span className='text-xs font-bold uppercase tracking-wider text-orange-500'>Last login</span>
                  <span className='text-sm font-black text-orange-950'>{formatLastLogin(lastLogin)}</span>
                </div>

                {/* Profile avatar — dropdown with actions */}
                <div className='relative' ref={profileRef}>
                  <button
                    type='button'
                    onClick={() => setIsProfileOpen((open) => !open)}
                    aria-expanded={isProfileOpen}
                    aria-haspopup='menu'
                    title='Account menu'
                    className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white p-2 ring-2 transition-all duration-200 hover:scale-105 hover:ring-orange-300 hover:shadow-md focus:outline-none focus:ring-orange-400 ${isProfileOpen ? 'ring-orange-400 shadow-md' : 'ring-transparent'
                      }`}
                  >
                    {(currentUser?.image || currentUser?.avatar) ? (
                      <img src={currentUser.image || currentUser.avatar} alt='Profile' className='h-full w-full object-cover' />
                    ) : (
                      <img src='/images/bhojExpress.jpg' alt='Profile' className='h-full w-full object-cover' />
                    )}
                  </button>

                  {isProfileOpen && (
                    <div
                      role='menu'
                      aria-label='Account menu'
                      className='absolute right-0 z-30 mt-3 w-64 overflow-hidden rounded-2xl border border-orange-200 bg-white text-orange-950 shadow-xl shadow-orange-950/15'
                    >
                      <div className='flex items-center gap-3 border-b border-orange-100 px-5 py-4'>
                        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-white p-2 text-sm font-black text-white overflow-hidden'>
                          {(currentUser?.image || currentUser?.avatar) ? (
                            <img src={currentUser.image || currentUser.avatar} alt='Profile' className='h-full w-full object-cover' />
                          ) : (
                            <img src='/images/bhojExpress.jpg' alt='Profile' className='h-full w-full object-cover' />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate font-black'>{currentUser?.name || 'Administrator'}</p>
                          <p className='text-xs font-bold uppercase tracking-wide text-orange-500'>Administrator</p>
                        </div>
                      </div>

                      <div className='p-2'>
                        <button
                          type='button'
                          role='menuitem'
                          onClick={() => {
                            setIsProfileOpen(false)
                            navigate('/menu')
                          }}
                          className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-950 hover:bg-orange-50'
                        >
                          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700'>🛒</span>
                          View Store
                        </button>

                        <button
                          type='button'
                          role='menuitem'
                          onClick={() => {
                            setIsProfileOpen(false)
                            navigate('/admin/settings/editprofile')
                          }}
                          className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-950 hover:bg-orange-50'
                        >
                          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700'>✏️</span>
                          Edit Details
                        </button>

                        <button
                          type='button'
                          role='menuitem'
                          onClick={() => {
                            setIsProfileOpen(false)
                            navigate('/admin/settings/changepassword')
                          }}
                          className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-950 hover:bg-orange-50'
                        >
                          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700'>🔒</span>
                          Change Password
                        </button>

                        <button
                          type='button'
                          role='menuitem'
                          onClick={() => {
                            setIsProfileOpen(false)
                            handleLogout()
                          }}
                          className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50'
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
              </div>
            </div>
          </header>

          <div className='p-4 sm:p-6 lg:p-8'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout