function Offers() {
  return (
    <main className='bg-orange-50 px-5 py-16 text-orange-950 lg:px-8'><div className='mx-auto max-w-7xl'><p className='text-sm font-bold uppercase tracking-[0.2em] text-orange-600'>Fresh reasons to order</p><h1 className='mt-3 text-5xl font-black tracking-tight sm:text-6xl'>Good food, better deals.</h1><p className='mt-5 max-w-xl text-lg leading-8 text-orange-950/60'>Treat yourself to something delicious and keep a little extra in your pocket.</p><div className='mt-12 grid gap-5 lg:grid-cols-3'>{[['WELCOME5', 'रु. 100 off your first order', 'Use code WELCOME5 at checkout.'], ['LUNCH20', '20% off lunch orders', 'Available every weekday from 11 AM to 2 PM.'], ['SWEET10', 'Free dessert on orders over रु. 3000', 'A sweet ending is always a good idea.']].map(([code, title, detail]) => <article key={code} className='rounded-[2rem] bg-amber-300 p-8'><span className='rounded-full bg-orange-950 px-3 py-1 text-xs font-bold tracking-wider text-amber-200'>{code}</span><h2 className='mt-8 text-2xl font-black'>{title}</h2><p className='mt-3 text-sm leading-6 text-orange-950/65'>{detail}</p><button type='button' className='mt-8 rounded-full bg-orange-950 px-6 py-3 text-sm font-bold text-white hover:bg-orange-800'>Use this offer →</button></article>)}</div></div></main>
  )
}

export default Offers
