import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders', {
          withCredentials: true,
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders for dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Compute dynamic stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
  
  const ordersTodayList = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= today;
  });
  
  const avgOrder = deliveredOrders.length > 0 
    ? (totalRevenue / deliveredOrders.length).toFixed(2)
    : 0;

  const stats = [
    { label: 'Total Revenue', value: `रु ${totalRevenue.toLocaleString()}`, tone: 'bg-orange-100 text-orange-700' },
    { label: 'Orders Today', value: ordersTodayList.length.toString(), tone: 'bg-amber-100 text-amber-700' },
    { label: 'Avg. Order', value: `रु ${avgOrder}`, tone: 'bg-yellow-100 text-yellow-700' },
    { label: 'Total Orders', value: orders.length.toString(), tone: 'bg-emerald-100 text-emerald-700' },
  ];

  // Top 4 items
  const itemCounts = {};
  deliveredOrders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    }
  });

  const sortedItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const totalItemsSold = Object.values(itemCounts).reduce((a, b) => a + b, 0);

  const colors = ['bg-orange-500', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-400'];
  const categoryData = sortedItems.map(([name, count], idx) => ({
    name,
    value: totalItemsSold > 0 ? Math.round((count / totalItemsSold) * 100) : 0,
    count,
    color: colors[idx % colors.length]
  }));

  // Sales Overview for last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    last7Days.push(d);
  }

  const dailySales = last7Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dayOrders = deliveredOrders.filter(o => {
      const oDate = new Date(o.createdAt);
      return oDate >= date && oDate < nextDay;
    });
    
    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return { dayName, revenue };
  });

  const maxDailyRevenue = Math.max(...dailySales.map(d => d.revenue), 1);
  const chartHeights = dailySales.map(d => (d.revenue / maxDailyRevenue) * 100);

  const recentOrders = orders.slice(0, 3).map(o => ({
    id: o.order_id || o._id.slice(-6),
    customer: o.name || 'Customer',
    total: `रु ${o.total}`,
    status: o.status
  }));

  const performance = [
    { label: 'Delivered Orders', value: deliveredOrders.length.toString(), detail: 'Total completed' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length.toString(), detail: 'Needs action' },
    { label: 'Cancelled Orders', value: orders.filter(o => o.status === 'Cancelled').length.toString(), detail: 'Lost sales' },
  ];

  if (loading) {
    return <div className="p-8 text-center text-orange-600 font-bold">Loading dashboard data...</div>;
  }

  return (
    <div className='space-y-6'>
      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <div key={stat.label} className='rounded-3xl border border-orange-100 bg-white p-5 shadow-sm'>
            <div className={`mb-4 inline-flex rounded-xl px-3 py-2 text-sm font-bold ${stat.tone}`}>
              {stat.label}
            </div>
            <p className={stat.value.includes('रु') ? 'text-3xl font-black text-emerald-600' : 'text-3xl font-black text-orange-950'}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className='grid gap-6 xl:grid-cols-[1.5fr_0.9fr]'>
        <div className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
          <div className='mb-5 flex items-center justify-between'>
            <h3 className='text-xl font-black text-orange-950'>Sales Overview (Last 7 Days)</h3>
          </div>

          <div className='flex h-52 items-end gap-3 mt-8'>
            {chartHeights.map((height, index) => (
              <div key={index} className='flex flex-1 flex-col items-center gap-2 group relative'>
                {/* Tooltip for chart */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-900 text-white text-xs py-1 px-2 rounded font-bold whitespace-nowrap z-10 pointer-events-none">
                  रु {dailySales[index].revenue.toLocaleString()}
                </div>
                <div className='w-full rounded-t-2xl bg-gradient-to-t from-orange-500 to-amber-400 cursor-pointer hover:opacity-80 transition-opacity' style={{ height: `${Math.max(height, 5)}%` }} />
                <span className='text-[10px] font-bold uppercase tracking-wide text-orange-500'>
                  {dailySales[index].dayName}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-black text-orange-950'>Recent Orders</h3>
          <div className='mt-5 space-y-4'>
            {recentOrders.map((order) => (
              <div key={order.id} className='flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 p-3'>
                <div>
                  <p className='font-black text-orange-950'>{order.id}</p>
                  <p className='text-sm text-orange-700'>{order.customer}</p>
                </div>
                <div className='text-right'>
                  <p className='font-black text-emerald-600'>{order.total}</p>
                  <span className='rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700'>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-gray-500">No orders found.</p>
            )}
          </div>
        </div>
      </section>

      <section className='grid gap-6 lg:grid-cols-3'>
        {performance.map((item) => (
          <div key={item.label} className='rounded-3xl border border-orange-100 bg-white p-5 shadow-sm'>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>{item.label}</p>
            <h3 className='mt-4 text-3xl font-black text-orange-950'>{item.value}</h3>
            <p className='mt-2 text-sm text-orange-700'>{item.detail}</p>
          </div>
        ))}
      </section>

      <section className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
        <div className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
          <div className='mb-5 flex items-center justify-between'>
            <h3 className='text-xl font-black text-orange-950'>Top Selling Items</h3>
            <span className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Based on delivered orders</span>
          </div>

          <div className='space-y-4'>
            {categoryData.length > 0 ? categoryData.map((item) => (
              <div key={item.name}>
                <div className='mb-1 flex items-center justify-between text-sm font-semibold text-orange-900'>
                  <span>{item.name}</span>
                  <span>{item.value}% ({item.count} sold)</span>
                </div>
                <div className='h-2.5 overflow-hidden rounded-full bg-orange-100'>
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No items sold yet.</p>}
          </div>
        </div>

        <div className='rounded-3xl border border-orange-100 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-black text-orange-950'>Summary Insight</h3>
          <div className='mt-5 space-y-4'>
            <div className='rounded-2xl bg-orange-50 p-4'>
              <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>Best seller</p>
              <p className='mt-2 text-lg font-black text-orange-950'>{categoryData[0]?.name || 'N/A'}</p>
              <p className='mt-1 text-sm text-orange-700'>{categoryData[0]?.count || 0} units sold overall</p>
            </div>

            <div className='rounded-2xl bg-amber-50 p-4'>
              <p className='text-xs font-bold uppercase tracking-[0.2em] text-amber-600'>Business Status</p>
              <p className='mt-2 text-lg font-black text-orange-950'>Today's Orders</p>
              <p className='mt-1 text-sm text-orange-700'>{ordersTodayList.length} orders received today</p>
            </div>

            <div className='rounded-2xl bg-emerald-50 p-4'>
              <p className='text-xs font-bold uppercase tracking-[0.2em] text-emerald-600'>Operational note</p>
              <p className='mt-2 text-lg font-black text-orange-950'>Order fulfillment</p>
              <p className='mt-1 text-sm text-orange-700'>
                {orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : 0}% delivery rate
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
