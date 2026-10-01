import { useState } from 'react'

function OrdersSection({ orders, advanceOrder }) {
  return (
    <section className='admin-panel'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='admin-panel-kicker'>Order management</p>
          <h3 className='mt-1 text-2xl font-black text-[#25211f]'>All orders</h3>
        </div>
        <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700'>
          {orders.length} recent
        </span>
      </div>
      <div className='mt-6 overflow-x-auto'>
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className='font-black text-[#25211f]'>{order.id}</span>
                  <span className='block text-[11px] text-[#a29a94]'>{order.time}</span>
                </td>
                <td>
                  <span className='font-bold text-[#37312d]'>{order.customer}</span>
                  <span className='block text-[11px] text-[#a29a94]'>{order.items}</span>
                </td>
                <td>
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ${order.tone}`}>
                    {order.status}
                  </span>
                </td>
                <td className='whitespace-nowrap font-black text-[#37312d]'>{order.total}</td>
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
    </section>
  )
}

function CustomersSection() {
  const customers = [
    ['AS', 'Aarav Sharma', '12 orders', 'bg-amber-100 text-amber-700'],
    ['MT', 'Maya Thompson', '9 orders', 'bg-orange-100 text-orange-700'],
    ['RK', 'Rohan Karki', '7 orders', 'bg-emerald-100 text-emerald-700'],
    ['SW', 'Sofia Williams', '5 orders', 'bg-sky-100 text-sky-700'],
  ]

  return (
    <section className='admin-panel'>
      <p className='admin-panel-kicker'>Customer management</p>
      <h3 className='mt-1 text-2xl font-black text-[#25211f]'>Your customers</h3>
      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        {customers.map(([initials, name, orders, tone]) => (
          <article key={name} className='flex items-center gap-3 rounded-xl border border-[#ebe5df] p-4'>
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-black ${tone}`}>
              {initials}
            </span>
            <div>
              <p className='font-black text-[#37312d]'>{name}</p>
              <p className='text-xs text-[#918b86]'>
                {orders} <span className='mx-1'>•</span> Active customer
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function MenuSection({ menuItems, onAddItem }) {
  return (
    <section className='admin-panel'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='admin-panel-kicker'>Menu management</p>
          <h3 className='mt-1 text-2xl font-black text-[#25211f]'>Menu items</h3>
        </div>
        <button type='button' onClick={onAddItem} className='admin-add-button'>+ Add item</button>
      </div>
      <div className='mt-6 grid gap-4 md:grid-cols-3'>
        {menuItems.map((item) => (
          <article key={item.name} className='rounded-xl border border-[#ebe5df] p-4'>
            <div className={`flex h-24 items-center justify-center rounded-xl text-5xl ${item.color}`}>
              {item.emoji}
            </div>
            <h4 className='mt-4 font-black text-[#37312d]'>{item.name}</h4>
            <p className='mt-1 text-sm font-bold text-emerald-600'>{item.price}</p>
            <p className='mt-3 text-xs text-[#918b86]'>{item.sold} sold this week</p>
            <button type='button' className='admin-text-button mt-3'>Edit item <span>→</span></button>
          </article>
        ))}
      </div>
    </section>
  )
}

function PromotionsSection() {
  const [promotions, setPromotions] = useState([
    { name: 'Welcome offer', code: 'WELCOME100', detail: 'Rs 100 off first order', active: true },
    { name: 'Weekend delight', code: 'WEEKEND20', detail: '20% off selected items', active: false },
  ])

  return (
    <section className='admin-panel'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='admin-panel-kicker'>Growth tools</p>
          <h3 className='mt-1 text-2xl font-black text-[#25211f]'>Promotions</h3>
        </div>
        <button
          type='button'
          className='admin-add-button'
          onClick={() =>
            setPromotions((current) => [
              ...current,
              { name: 'New promotion', code: `OFFER${current.length + 1}`, detail: 'Draft promotion', active: false },
            ])
          }
        >
          + Add promotion
        </button>
      </div>
      <div className='mt-6 space-y-3'>
        {promotions.map((promotion, index) => (
          <div
            key={`${promotion.code}-${index}`}
            className='flex flex-col justify-between gap-4 rounded-xl border border-[#ebe5df] p-4 sm:flex-row sm:items-center'
          >
            <div>
              <p className='font-black text-[#37312d]'>{promotion.name}</p>
              <p className='mt-1 text-xs text-[#918b86]'>
                {promotion.detail} <span className='mx-1'>•</span>{' '}
                <strong className='text-orange-600'>{promotion.code}</strong>
              </p>
            </div>
            <button
              type='button'
              onClick={() =>
                setPromotions((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, active: !item.active } : item
                  )
                )
              }
              className={`rounded-full px-3 py-1 text-xs font-black ${
                promotion.active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#f0ebe6] text-[#918b86]'
              }`}
            >
              {promotion.active ? 'Active' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function AnalyticsSection() {
  return (
    <div className='space-y-5'>
      <section className='grid gap-4 sm:grid-cols-3'>
        <article className='admin-stat-card'>
          <div className='admin-stat-icon bg-orange-100 text-orange-600'>↗</div>
          <div>
            <p className='admin-muted'>Conversion rate</p>
            <p className='mt-1 text-2xl font-black'>18.6%</p>
            <p className='mt-2 text-xs font-bold text-emerald-600'>
              +3.2% <span className='font-medium text-[#918b86]'>this month</span>
            </p>
          </div>
        </article>
        <article className='admin-stat-card'>
          <div className='admin-stat-icon bg-sky-100 text-sky-700'>◒</div>
          <div>
            <p className='admin-muted'>Repeat customers</p>
            <p className='mt-1 text-2xl font-black'>64%</p>
            <p className='mt-2 text-xs font-bold text-emerald-600'>
              +8.4% <span className='font-medium text-[#918b86]'>this month</span>
            </p>
          </div>
        </article>
        <article className='admin-stat-card'>
          <div className='admin-stat-icon bg-emerald-100 text-emerald-700'>★</div>
          <div>
            <p className='admin-muted'>Avg. rating</p>
            <p className='mt-1 text-2xl font-black'>4.9 / 5</p>
            <p className='mt-2 text-xs font-bold text-emerald-600'>
              +0.2 <span className='font-medium text-[#918b86]'>this month</span>
            </p>
          </div>
        </article>
      </section>
      <section className='admin-panel'>
        <p className='admin-panel-kicker'>Performance report</p>
        <h3 className='mt-1 text-2xl font-black text-[#25211f]'>Weekly sales trend</h3>
        <div className='mt-8 grid h-52 grid-cols-7 items-end gap-3'>
          {[42, 58, 48, 72, 66, 88, 76].map((height, index) => (
            <div key={index} className='flex h-full flex-col justify-end gap-2'>
              <div className='rounded-t-lg bg-orange-500' style={{ height: `${height}%` }} />
              <span className='text-center text-[10px] font-bold text-[#918b86]'>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SettingsSection() {
  const [notifications, setNotifications] = useState(true)
  const [autoAccept, setAutoAccept] = useState(false)

  return (
    <section className='admin-panel max-w-2xl'>
      <p className='admin-panel-kicker'>Workspace preferences</p>
      <h3 className='mt-1 text-2xl font-black text-[#25211f]'>Settings</h3>
      <div className='mt-6 divide-y divide-[#ebe5df]'>
        <label className='flex cursor-pointer items-center justify-between gap-4 py-4'>
          <span>
            <strong className='block text-sm text-[#37312d]'>Order notifications</strong>
            <small className='text-xs text-[#918b86]'>Get alerts when a new order arrives.</small>
          </span>
          <input
            type='checkbox'
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
            className='h-5 w-5 accent-orange-600'
          />
        </label>
        <label className='flex cursor-pointer items-center justify-between gap-4 py-4'>
          <span>
            <strong className='block text-sm text-[#37312d]'>Auto-accept orders</strong>
            <small className='text-xs text-[#918b86]'>Accept incoming orders automatically.</small>
          </span>
          <input
            type='checkbox'
            checked={autoAccept}
            onChange={(event) => setAutoAccept(event.target.checked)}
            className='h-5 w-5 accent-orange-600'
          />
        </label>
        <label className='admin-field py-4'>
          Restaurant name
          <input defaultValue='Bhoj Express' />
        </label>
        <button type='button' className='admin-primary-button'>Save settings</button>
      </div>
    </section>
  )
}

function AdminSection({ activeNav, orders, advanceOrder, menuItems, onAddItem }) {
  if (activeNav === 'Orders') return <OrdersSection orders={orders} advanceOrder={advanceOrder} />
  if (activeNav === 'Customers') return <CustomersSection />
  if (activeNav === 'Menu') return <MenuSection menuItems={menuItems} onAddItem={onAddItem} />
  if (activeNav === 'Promotions') return <PromotionsSection />
  if (activeNav === 'Analytics') return <AnalyticsSection />
  if (activeNav === 'Settings') return <SettingsSection />
  return null
}

export default AdminSection