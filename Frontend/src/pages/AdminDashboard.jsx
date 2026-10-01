import { useMemo, useRef, useState } from 'react'
import AdminSection from '../admin/AdminSections.jsx'

const navigation = [
  { label: 'Overview', icon: '◈' },
  { label: 'Orders', icon: '▣', count: 8 },
  { label: 'Menu', icon: '◫' },
  { label: 'Customers', icon: '♙' },
  { label: 'Promotions', icon: '◇' },
]

const initialOrders = [
  { id: '#1048', customer: 'Aarav Sharma', items: '2 items', total: 'रु 28.40', time: '2 min ago', status: 'New', initials: 'AS', tone: 'bg-amber-100 text-amber-700' },
  { id: '#1047', customer: 'Maya Thompson', items: '4 items', total: 'रु 46.85', time: '8 min ago', status: 'Preparing', initials: 'MT', tone: 'bg-orange-100 text-orange-700' },
  { id: '#1046', customer: 'Rohan Karki', items: '1 item', total: 'रु 12.90', time: '14 min ago', status: 'Ready', initials: 'RK', tone: 'bg-emerald-100 text-emerald-700' },
  { id: '#1045', customer: 'Sofia Williams', items: '3 items', total: 'रु 35.20', time: '21 min ago', status: 'Out for delivery', initials: 'SW', tone: 'bg-sky-100 text-sky-700' },
]

const menuItems = [
  { name: 'Tandoori Butter Bowl', sold: 84, price: 'रु 1,806', emoji: '🍛', color: 'bg-orange-100' },
  { name: 'Crispy Masala Wrap', sold: 67, price: 'रु 1,330', emoji: '🌯', color: 'bg-amber-100' },
  { name: 'Mango Cloud Lassi', sold: 52, price: 'रु 735', emoji: '🥭', color: 'bg-yellow-100' },
]

const statusStyles = {
  New: 'bg-amber-100 text-amber-700',
  Preparing: 'bg-orange-100 text-orange-700',
  Ready: 'bg-emerald-100 text-emerald-700',
  'Out for delivery': 'bg-sky-100 text-sky-700',
}

function StatCard({ label, value, change, icon, accent }) {
  return (
    <article className='admin-stat-card'>
      <div className={`admin-stat-icon ${accent}`} aria-hidden='true'>
        {icon}
      </div>
      <div>
        <p className='admin-muted'>{label}</p>
        <p className={`mt-1 text-2xl font-black ${value.includes('रु') ? 'text-emerald-600' : ''}`}>
          {value}
        </p>
        <p className='mt-2 text-xs font-bold text-emerald-600'>
          {change} <span className='font-medium text-[#918b86]'>vs last week</span>
        </p>
      </div>
    </article>
  )
}

function RevenueChart() {
  const heights = [38, 48, 42, 65, 55, 82, 70]
  return (
    <div className='mt-7 grid h-48 grid-cols-7 items-end gap-3'>
      {heights.map((height, index) => (
        <div key={index} className='flex h-full flex-col justify-end gap-2'>
          <div className='rounded-t-lg bg-orange-500' style={{ height: `${height}%` }} />
          <span className='text-center text-[10px] font-bold text-[#b1aaa4]'>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
          </span>
        </div>
      ))}
    </div>
  )
}

function Overview({ visibleOrders, advanceOrder, setActiveNav, menuItems }) {
  return (
    <div className='space-y-5'>
      <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Total revenue' value='रु 12,846.40' change='+18.6%' icon='रु' accent='bg-orange-100 text-orange-600' />
        <StatCard label='Total orders' value='1,248' change='+12.4%' icon='↗' accent='bg-amber-100 text-amber-700' />
        <StatCard label='Average order value' value='रु 27.54' change='+5.2%' icon='◒' accent='bg-sky-100 text-sky-700' />
        <StatCard label='Customer rating' value='4.9 / 5' change='+0.2' icon='★' accent='bg-emerald-100 text-emerald-700' />
      </section>

      <section className='grid gap-5 xl:grid-cols-[1.4fr_0.9fr]'>
        <article className='admin-panel'>
          <p className='admin-panel-kicker'>Revenue overview</p>
          <p className='mt-1 text-2xl font-black'>
            रु 12,846 <span className='text-sm text-emerald-600'>+18.6%</span>
          </p>
          <RevenueChart />
        </article>

        <article className='admin-panel'>
          <p className='admin-panel-kicker'>Order activity</p>
          <p className='mt-1 text-2xl font-black'>
            1,248 <span className='text-sm text-emerald-600'>+12.4%</span>
          </p>
          <div className='mt-8 flex justify-center'>
            <div className='admin-donut'>
              <div>
                <strong>1,248</strong>
                <span>orders</span>
              </div>
            </div>
          </div>
          <div className='mt-7 grid grid-cols-2 gap-3 text-xs font-bold text-[#625b56]'>
            <span>
              <i className='admin-legend bg-orange-500' />Delivery <b>62%</b>
            </span>
            <span>
              <i className='admin-legend bg-amber-300' />Pickup <b>24%</b>
            </span>
            <span>
              <i className='admin-legend bg-sky-400' />Dine-in <b>14%</b>
            </span>
          </div>
        </article>
      </section>

      <section className='grid gap-5 xl:grid-cols-[1.35fr_0.95fr]'>
        <article className='admin-panel overflow-hidden'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='admin-panel-kicker'>Live order queue</p>
              <h3 className='mt-1 text-xl font-black'>Recent orders</h3>
            </div>
            <button
              type='button'
              className='admin-text-button'
              onClick={() => setActiveNav('Orders')}
            >
              View all orders <span>→</span>
            </button>
          </div>
          <div className='mt-5 overflow-x-auto'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className='text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <small className='block text-[11px] text-[#a29a94]'>{order.time}</small>
                    </td>
                    <td>
                      {order.customer}
                      <small className='block text-[11px] text-[#a29a94]'>{order.items}</small>
                    </td>
                    <td>
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='font-black'>{order.total}</td>
                    <td className='text-right'>
                      <button
                        type='button'
                        onClick={() => advanceOrder(order.id)}
                        disabled={order.status === 'Out for delivery'}
                        className='admin-action-button'
                      >
                        {order.status === 'Out for delivery' ? 'Completed' : 'Advance'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className='admin-panel'>
          <p className='admin-panel-kicker'>Menu performance</p>
          <h3 className='mt-1 text-xl font-black'>Top sellers</h3>
          <div className='mt-5 space-y-4'>
            {menuItems.map((item) => (
              <div key={item.name} className='flex items-center gap-3'>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${item.color}`}>
                  {item.emoji}
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-black'>{item.name}</p>
                  <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0ebe6]'>
                    <div className='h-full rounded-full bg-orange-500' style={{ width: `${item.sold}%` }} />
                  </div>
                  <p className='mt-1 text-[10px] text-[#a29a94]'>{item.sold} sold this week</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type='button'
            onClick={() => setActiveNav('Menu')}
            className='admin-add-button mt-6 w-full'
          >
            Manage menu
          </button>
        </article>
      </section>
    </div>
  )
}

function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [range, setRange] = useState('Last 7 days')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const sidebarRef = useRef(null)
  const mainRef = useRef(null)

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) =>
        `${order.id} ${order.customer} ${order.status}`.toLowerCase().includes(search.toLowerCase())
      ),
    [orders, search]
  )

  const selectView = (view) => {
    setActiveNav(view)
    setIsSidebarOpen(false)
  }

  const advanceOrder = (orderId) => {
    const steps = ['New', 'Preparing', 'Ready', 'Out for delivery']
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order
        return {
          ...order,
          status: steps[Math.min(steps.indexOf(order.status) + 1, steps.length - 1)],
        }
      })
    )
  }

  const handoffScroll = (event, sourceRef, targetRef) => {
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target || event.deltaY === 0) return

    const atTop = source.scrollTop <= 0 && event.deltaY < 0
    const atBottom = source.scrollTop + source.clientHeight >= source.scrollHeight - 1 && event.deltaY > 0
    const targetCanScroll = target.scrollHeight > target.clientHeight

    if ((atTop || atBottom) && targetCanScroll) {
      event.preventDefault()
      target.scrollTop += event.deltaY
    }
  }

  return (
    <div className='admin-shell'>
      <aside
        ref={sidebarRef}
        onWheel={(event) => handoffScroll(event, sidebarRef, mainRef)}
        className={`admin-sidebar ${isSidebarOpen ? 'is-open' : ''}`}
      >
        <div className='flex items-center justify-between'>
          <a href='/' className='flex items-center gap-3'>
            <img
              src='/bhojExpress(1).jpg'
              alt='Bhoj Express logo'
              className='h-10 w-10 rounded-xl object-cover'
            />
            <span className='text-lg font-black text-white'>
              Bhoj <span className='text-orange-300'>Express</span>
            </span>
          </a>
          <button
            type='button'
            className='admin-close md:hidden'
            onClick={() => setIsSidebarOpen(false)}
            aria-label='Close menu'
          >
            ×
          </button>
        </div>

        <div className='admin-restaurant-card mt-10'>
          <span className='admin-live-dot' /> Open for orders{' '}
          <span className='ml-auto text-orange-200'>⌄</span>
          <p className='mt-2 text-xs text-orange-100/60'>12:00 PM - 11:00 PM today</p>
        </div>

        <p className='admin-side-label'>Workspace</p>
        <nav className='space-y-1' aria-label='Admin navigation'>
          {navigation.map((item) => (
            <button
              key={item.label}
              type='button'
              onClick={() => selectView(item.label)}
              className={`admin-nav-item ${activeNav === item.label ? 'active' : ''}`}
            >
              <span className='w-6 text-center text-lg'>{item.icon}</span>
              <span>{item.label}</span>
              {item.count && (
                <span className='ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white'>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <p className='admin-side-label'>Manage</p>
        <nav className='space-y-1'>
          {[['Analytics', '▤'], ['Settings', '⚙']].map(([label, icon]) => (
            <button
              key={label}
              type='button'
              onClick={() => selectView(label)}
              className={`admin-nav-item ${activeNav === label ? 'active' : ''}`}
            >
              <span className='w-6 text-center text-lg'>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className='mt-auto hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block'>
          <p className='text-xs font-bold text-orange-200'>Need a hand?</p>
          <p className='mt-1 text-xs leading-5 text-white/50'>
            Visit the help center or talk to our team.
          </p>
        </div>

        <div className='mt-6 flex items-center gap-3 border-t border-white/10 pt-5'>
          <span className='flex h-9 w-9 items-center justify-center rounded-full bg-orange-300 text-xs font-black text-orange-950'>
            RS
          </span>
          <div>
            <p className='text-sm font-bold text-white'>Riya Sharma</p>
            <p className='text-xs text-white/45'>Owner account</p>
          </div>
        </div>
      </aside>

      <main
        ref={mainRef}
        onWheel={(event) => handoffScroll(event, mainRef, sidebarRef)}
        className='admin-main'
      >
        <header className='admin-topbar'>
          <button
            type='button'
            className='admin-menu-button md:hidden'
            onClick={() => setIsSidebarOpen(true)}
            aria-label='Open menu'
          >
            ☰
          </button>
          <div>
            <p className='admin-eyebrow'>Thursday, September 10, 2026</p>
            <h1 className='mt-1 text-2xl font-black sm:text-3xl'>
              Good morning, Riya <span aria-hidden='true'>✦</span>
            </h1>
          </div>
          <div className='ml-auto flex items-center gap-3'>
            <button type='button' className='admin-icon-button' aria-label='Notifications'>
              ♢<span className='admin-notification-dot' />
            </button>
            <button
              type='button'
              className='admin-store-button'
              onClick={() => window.location.assign('/')}
            >
              View storefront <span aria-hidden='true'>↗</span>
            </button>
          </div>
        </header>

        <div className='admin-content'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
            <div>
              <p className='admin-eyebrow'>
                {activeNav === 'Overview' ? 'Today at a glance' : 'Workspace'}
              </p>
              <h2 className='mt-1 text-xl font-black'>
                {activeNav === 'Overview' ? 'Your restaurant is thriving.' : activeNav}
              </h2>
            </div>
            <div className='flex items-center gap-3'>
              <label className='admin-search'>
                <span aria-hidden='true'>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Search orders'
                  aria-label='Search orders'
                />
              </label>
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className='admin-select'
                aria-label='Date range'
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This year</option>
              </select>
            </div>
          </div>

          {activeNav === 'Overview' ? (
            <Overview
              visibleOrders={visibleOrders}
              advanceOrder={advanceOrder}
              setActiveNav={selectView}
              menuItems={menuItems}
            />
          ) : (
            <AdminSection
              activeNav={activeNav}
              orders={orders}
              advanceOrder={advanceOrder}
              menuItems={menuItems}
              onAddItem={() => setIsAddOpen(true)}
            />
          )}
        </div>
      </main>

      {isAddOpen && (
        <div
          className='admin-modal-backdrop'
          role='presentation'
          onMouseDown={() => setIsAddOpen(false)}
        >
          <form
            className='admin-modal'
            onSubmit={(event) => {
              event.preventDefault()
              setIsAddOpen(false)
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className='flex items-start justify-between'>
              <div>
                <p className='admin-panel-kicker'>Menu management</p>
                <h2 className='mt-1 text-2xl font-black'>Add menu item</h2>
              </div>
              <button
                type='button'
                onClick={() => setIsAddOpen(false)}
                className='admin-modal-close'
                aria-label='Close dialog'
              >
                ×
              </button>
            </div>

            <label className='admin-field'>
              Item name
              <input required placeholder='e.g. Garlic naan' />
            </label>

            <label className='admin-field'>
              Category
              <select>
                <option>Indian classics</option>
                <option>Street favorites</option>
                <option>Drinks</option>
              </select>
            </label>

            <label className='admin-field'>
              Price
              <input required type='number' step='.01' placeholder='0.00' />
            </label>

            <button type='submit' className='admin-primary-button'>
              Save menu item
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard