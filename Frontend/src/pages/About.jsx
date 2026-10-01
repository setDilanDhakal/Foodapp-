function About({ onHome, onContact }) {
  return (
    <main className="bg-orange-50 text-orange-950">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-orange-950 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#fb923c_0%,_transparent_40%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-32 relative z-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
              <span className="h-2 w-2 rounded-full bg-orange-400" /> Since 2026
            </div>
            <h1 className="mt-4 max-w-2xl text-5xl font-black leading-tight sm:text-7xl">
              Food made for feeling at home.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-orange-100/70">
              Bhoj Express started with a simple idea: a delivered meal should
              feel personal, generous, and worth looking forward to.
            </p>
          </div>
          <div className="relative rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-700 p-10 text-center shadow-2xl shadow-orange-900/50 transform transition duration-500 hover:scale-[1.02]">
            <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-white ring-8 ring-white/20 shadow-xl">
              <img
                src="images/bhojExpress.jpg"
                alt="Bhoj Express logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div>
            <p className="mt-8 text-3xl font-black tracking-tight">Made with heart.</p>
            <p className="mt-2 text-orange-100 font-medium tracking-wide">Delivered with care.</p>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              More than a meal
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              The good stuff should be easy to find.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-8 text-orange-950/70">
            <p>
              We bring together the flavors people love and the convenience busy
              days need. Every menu choice is selected to be comforting,
              exciting, and easy to share. It's not just about eating; it's about
              experiencing a moment of joy amidst a chaotic day.
            </p>
            <p>
              From our kitchen partners to the person at your door, we care
              about the small details that turn a delivery into a moment. We
              taste everything, package it beautifully, and ensure it arrives hot
              and fresh.
            </p>
          </div>
        </div>
      </section>

      {/* 3. By The Numbers Section */}
      <section className="border-y border-orange-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:grid-cols-4 lg:px-8">
          {[
            ["2,000+", "Happy foodies"],
            ["4.9 / 5", "Average rating"],
            ["30 min", "Average delivery"],
            ["50+", "Kitchen partners"],
          ].map(([value, label], idx) => (
            <div
              key={label}
              className={`border-orange-100 sm:border-r sm:last:border-0 ${idx !== 0 ? 'sm:pl-8' : ''}`}
            >
              <p className="text-4xl font-black text-orange-600">{value}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-orange-950/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What Guides Us Section */}
      <section className="bg-orange-100/50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              What guides us
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Our promise, in three parts.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              [
                "01",
                "Flavor first",
                "We look for meals that make the first bite memorable and the last one satisfying. We never compromise on taste.",
              ],
              [
                "02",
                "People matter",
                "We build relationships with cooks, couriers, and customers one order at a time. Community is our backbone.",
              ],
              [
                "03",
                "Keep it warm",
                "Great service should feel thoughtful, from the kitchen to your front door. Delivery is an art form to us.",
              ],
            ].map(([number, title, text]) => (
              <article key={number} className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-900/5 border border-orange-100">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black transition-opacity group-hover:opacity-10">
                  {number}
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-lg font-black text-orange-600">
                  {number}
                </span>
                <h3 className="mt-8 text-2xl font-black text-orange-950">{title}</h3>
                <p className="mt-4 text-base leading-7 text-orange-950/65 relative z-10">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Process Section */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                How we work
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                From their kitchen to your table.
              </h2>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-orange-200 before:via-orange-400 before:to-orange-200 hidden sm:block"></div>
            
            <div className="space-y-10">
              {[
                ["Source", "We partner with top-rated local restaurants and talented chefs."],
                ["Prepare", "Your meal is cooked fresh to order, exactly how you like it."],
                ["Package", "Sealed in eco-friendly, heat-retaining containers."],
                ["Deliver", "Brought to your door with a smile, ready to enjoy."],
              ].map(([title, desc], i) => (
                <div key={title} className="flex gap-6 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white font-black shadow-lg shadow-orange-600/30">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{title}</h3>
                    <p className="mt-2 text-orange-950/70">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full h-[500px] rounded-[2rem] bg-orange-200 overflow-hidden relative shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent mix-blend-overlay"></div>
             <img src="/images/chef.avif" alt="Chef preparing food" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 6. Sustainability Section */}
      <section className="bg-emerald-950 text-emerald-50 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-emerald-900/50 rounded-full blur-3xl"></div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 relative z-10 text-center">
          <span className="text-5xl mb-6 inline-block">🌱</span>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-white max-w-2xl mx-auto">
            Committed to a greener tomorrow.
          </h2>
          <p className="mt-6 text-lg leading-8 text-emerald-100/70 max-w-2xl mx-auto">
            We believe that good food shouldn't cost the earth. That's why 100% of our packaging is biodegradable, and we're actively transitioning our delivery fleet to electric vehicles. 
          </p>
          <div className="mt-10 flex justify-center gap-8 text-emerald-300 font-bold tracking-wider uppercase text-sm">
            <span>Zero Plastic</span>
            <span>•</span>
            <span>Carbon Neutral</span>
            <span>•</span>
            <span>Local Sourcing</span>
          </div>
        </div>
      </section>

      {/* 7. Join the Family (Careers/Partnerships) */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[2rem] bg-orange-100 p-10 sm:p-14 transition hover:bg-orange-200/80">
            <h3 className="text-3xl font-black">Become a Rider</h3>
            <p className="mt-4 text-orange-950/70 text-lg">
              Enjoy flexible hours, competitive pay, and the freedom of the open road. Join our fleet of dedicated delivery professionals today.
            </p>
            <a href="/contact" className="mt-8 inline-flex items-center gap-2 font-bold text-orange-700 hover:text-orange-900">
              Apply now <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="rounded-[2rem] bg-amber-100 p-10 sm:p-14 transition hover:bg-amber-200/80">
            <h3 className="text-3xl font-black">Partner with Us</h3>
            <p className="mt-4 text-amber-950/70 text-lg">
              Are you a restaurant owner looking to expand your reach? Partner with Bhoj Express to deliver your culinary masterpieces to more hungry customers.
            </p>
            <a href="/contact" className="mt-8 inline-flex items-center gap-2 font-bold text-amber-700 hover:text-amber-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="mx-5 mb-20 rounded-[2.5rem] bg-gradient-to-br from-amber-300 to-amber-400 lg:mx-auto lg:max-w-7xl relative overflow-hidden shadow-xl shadow-amber-900/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex flex-col items-start justify-between gap-8 px-10 py-16 sm:flex-row sm:items-center sm:px-16 relative z-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-orange-950">
              Have a question for our team?
            </h2>
            <p className="mt-3 text-lg text-orange-950/75">
              We would love to hear from you. We're here to help 24/7.
            </p>
          </div>
          <a href="/contact" className="shrink-0">
            <button
              type="button"
              onClick={onContact}
              className="rounded-full bg-orange-950 px-8 py-4 text-base font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-950/30"
            >
              Get in touch <span aria-hidden="true">→</span>
            </button>
          </a>
        </div>
      </section>
      
      <div className="pb-10 text-center">
        <a href="/">
          <button
            type="button"
            onClick={onHome}
            className="text-sm font-bold tracking-wide text-orange-600 transition hover:text-orange-800 hover:-translate-x-1 flex items-center gap-2 mx-auto"
          >
            <span aria-hidden="true">←</span> Back to home
          </button>
        </a>
      </div>
    </main>
  );
}

export default About;
