import React from 'react';

function Stars({ value = "5.0" }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            Number(value) > i ? "text-amber-400" : "text-orange-100"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5.8 5.03L18.4 22 12 18.27 5.6 22l1.4-7.7L2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const HeroSlide = () => {
    return (
        <div>
            <section
                id="home"
                className="relative isolate border-b border-orange-100"
            >
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_20%,_#fed7aa_0,_transparent_34%),linear-gradient(115deg,_#fff7ed_0%,_#ffedd5_54%,_#fed7aa_100%)]" />
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
                            <span className="h-2 w-2 rounded-full bg-green-500" /> Delivering
                            fresh today
                        </div>
                        <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
                            Food that feels like{" "}
                            <span className="text-orange-600">home.</span>
                        </h1>
                        <p className="mt-7 max-w-xl text-lg leading-8 text-orange-900/70">
                            Big flavors, honest ingredients, and a warm delivery to your
                            doorstep. Discover your next comfort meal with Bhoj Express.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <a
                                href="menu"
                                className="rounded-full bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-transform hover:-translate-y-0.5 hover:bg-orange-700"
                            >
                                Explore the menu <span aria-hidden="true">→</span>
                            </a>
                            <a
                                href="#how-it-works"
                                className="rounded-full border border-orange-300 bg-white/60 px-7 py-3.5 text-sm font-bold text-orange-900 hover:bg-white"
                            >
                                How it works
                            </a>
                        </div>
                        <div className="mt-10 flex items-center gap-4 text-sm text-orange-900/70">
                            <div className="flex -space-x-2" aria-hidden="true">
                                {["MR", "JK", "AT"].map((initials) => (
                                    <span
                                        key={initials}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-50 bg-orange-800 text-[10px] font-bold text-white"
                                    >
                                        {initials}
                                    </span>
                                ))}
                            </div>
                            <span>
                                <strong className="text-orange-950">4.9/5</strong> from 2,000+
                                happy foodies
                            </span>
                        </div>
                    </div>

                    {/* Right column — with extra padding so floating badges don't clip */}
                    <div className="relative mx-auto w-full max-w-lg px-6 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10">
                        {/* Top-right rating badge */}
                        <div className="absolute right-0 top-0 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-orange-900/10">
                            <Stars value="4.9" />
                            <p className="mt-1 text-xs font-medium text-orange-900/60">
                                Loved by locals
                            </p>
                        </div>

                        {/* Main card */}
                        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-orange-950 p-5 shadow-2xl shadow-orange-950/20">
                            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] text-white">

                                {/* Background image — brighter */}
                                <img
                                    src="/images/myrestaurant.webp"
                                    alt="Featured dish"
                                    className="absolute inset-0 h-full w-full object-cover brightness-110 saturate-105"
                                />

                                {/* Lighter gradient — only darkens top/bottom for text */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />

                                {/* Content */}
                                <div className="relative flex h-full flex-col justify-between p-7">
                                    <div className="flex items-start justify-between">
                                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-100 drop-shadow-md">
                                            Bhoj / Express
                                        </span>
                                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
                                            #01
                                        </span>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-3xl font-black drop-shadow-lg">Made with heart.</p>
                                        <p className="mt-2 text-orange-100 drop-shadow-md">Delivered with care.</p>
                                    </div>

                                    <div className="flex items-end justify-between text-xs font-semibold text-orange-100">
                                        <span className="drop-shadow-md">
                                            Comfort food
                                            <br />
                                            for every mood
                                        </span>
                                        <span className="text-right drop-shadow-md">
                                            Est. 2026
                                            <br />
                                            Fresh daily
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom-left delivery badge */}
                        <div className="absolute bottom-0 left-0 z-10 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-orange-900/10">
                            <p className="text-2xl font-black text-orange-600">30 min</p>
                            <p className="text-xs font-medium text-orange-900/60">
                                Average delivery
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HeroSlide;
