import { Link } from 'react-router-dom'

const footerLinks = {
  Explore: [
    { label: 'Home', href: '/' },
    { label: 'Our menu', href: '/menu' },
    { label: 'Offers', href: '/offers' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/login' },
  ],
  Support: [
    { label: 'Help center', href: '/contact' },
    { label: 'Track order', href: '/cart' },
    { label: 'Terms & privacy', href: '/about' },
  ],
}

function Footer() {
  const scrollToTop = () => window.scroll(0, 0)

  return (
    <footer className='bg-orange-950 text-orange-50'>
      <div className='mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8'>
        <div>
          <Link to='/' onClick={scrollToTop} className='flex items-center gap-3' aria-label='Bhoj Express home'>
            <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-orange-400'>
              <img
                src='images/bhojExpress.jpg'
                alt='Bhoj Express logo'
                className='h-full w-full rounded-full object-contain'
              />
            </div>
            <span className='text-xl font-bold tracking-tight text-white'>Bhoj Express</span>
          </Link>
          <p className='mt-5 max-w-xs text-sm leading-6 text-orange-200'>
            Fresh, flavorful meals delivered to your door with a little extra warmth in every order.
          </p>
          <a href='mailto:hello@bhojexpress.com' onClick={scrollToTop} className='mt-5 inline-block text-sm font-semibold text-orange-300 hover:text-white'>
            hello@bhojexpress.com
          </a>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h2 className='text-sm font-bold uppercase tracking-wider text-orange-300'>{title}</h2>
            <ul className='mt-4 space-y-3'>
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} onClick={scrollToTop} className='text-sm text-orange-100 transition-colors hover:text-white'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='border-t border-orange-900'>
        <div className='mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-orange-300 sm:flex-row sm:items-center sm:justify-between lg:px-8'>
          <p>&copy; 2026 Bhoj Express. All rights reserved.</p>
          <p>Made for food lovers, delivered with care.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer