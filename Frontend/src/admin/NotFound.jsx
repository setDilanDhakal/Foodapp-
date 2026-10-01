import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-orange-500'>404</p>
        <h3 className='mt-3 text-3xl font-black text-orange-950'>Page not found</h3>
        <p className='mt-3 text-orange-700'>The admin page you are looking for does not exist.</p>
        <Link to='/admin/dashboard' className='mt-6 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700'>Back to Dashboard</Link>
      </div>
    </div>
  )
}

export default NotFound
