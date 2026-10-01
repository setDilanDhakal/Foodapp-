import React from 'react';

const WhyBhojExpress = () => {
    return (
        <div>
            <section
                id="why-us"
                className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
            >
                <div className="max-w-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                        Why Bhoj Express
                    </p>
                    <h2 className="mt-2 text-4xl font-black tracking-tight">
                        Built for busy appetites.
                    </h2>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: "⚡",
                            title: "Lightning delivery",
                            text: "Hot meals at your door in 30 minutes or less, every time.",
                        },
                        {
                            icon: "🌿",
                            title: "Fresh ingredients",
                            text: "We source locally and cook every order from scratch.",
                        },
                        {
                            icon: "🔒",
                            title: "Secure payments",
                            text: "Multiple safe payment options with instant confirmation.",
                        },
                        {
                            icon: "💬",
                            title: "24/7 support",
                            text: "Real humans ready to help whenever you need us.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-3xl border border-orange-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/5"
                        >
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                                {item.icon}
                            </span>
                            <h3 className="mt-5 text-lg font-black tracking-tight">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-orange-950/60">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default WhyBhojExpress;
