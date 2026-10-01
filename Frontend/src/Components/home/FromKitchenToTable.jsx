import React from 'react';

const FromKitchenToTable = () => {
    return (
        <div>
            <section
                id="how-it-works"
                className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
            >
                <div className="max-w-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                        Simple as 1, 2, yum
                    </p>
                    <h2 className="mt-2 text-4xl font-black tracking-tight">
                        From our kitchen to your table.
                    </h2>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {[
                        [
                            "01",
                            "Choose your craving",
                            "Browse a menu built around big flavor and easy choices.",
                        ],
                        [
                            "02",
                            "We cook it fresh",
                            "Our kitchen starts your order when you place it, never before.",
                        ],
                        [
                            "03",
                            "Enjoy the moment",
                            "Follow your delivery and get ready for a meal worth sharing.",
                        ],
                    ].map(([number, title, text], index) => (
                        <div
                            key={number}
                            className="group relative border-t-2 border-orange-200 pt-6 transition-all duration-500 hover:border-orange-500 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 120}ms` }}
                        >
                            <span className="absolute -top-[2px] left-0 h-[2px] w-0 bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 group-hover:w-full" />

                            <span className="inline-block text-sm font-black text-orange-600 transition-transform duration-500 group-hover:-translate-y-1">
                                {number}
                            </span>

                            <h3 className="mt-12 text-xl font-black tracking-tight transition-colors duration-300 group-hover:text-orange-700">
                                {title}
                            </h3>

                            <p className="mt-3 max-w-xs text-sm leading-6 text-orange-950/60">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default FromKitchenToTable;
