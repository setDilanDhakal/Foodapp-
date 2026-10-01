import React from 'react';

const Members = () => {
    return (
        <div>
            {/* ===== NEW SECTION: Newsletter signup ===== */}
            <section className="border-t border-orange-200 bg-white">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                            Stay in the loop
                        </p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight">
                            Never miss a delicious deal.
                        </h2>
                        <p className="mt-4 max-w-md text-orange-950/60">
                            Subscribe for weekly specials, new dishes, and members-only
                            discounts delivered straight to your inbox.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            aria-label="Email address"
                            className="w-full rounded-full border border-orange-200 bg-orange-50 px-6 py-4 text-sm font-semibold text-orange-950 placeholder:text-orange-950/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        />
                        <button
                            type="submit"
                            className="shrink-0 rounded-full bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-transform hover:-translate-y-0.5 hover:bg-orange-700"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Members;
