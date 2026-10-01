import React from 'react';

const ReadyForApetite = () => {
    return (
        <div>
            <section
                id="order"
                className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-orange-200">
                    <img
                        src="images/bhojExpress.jpg"
                        alt="Bhoj Express"
                        className="h-full w-full rounded-full object-contain"
                    />
                </div>
                <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                    Ready when your appetite is.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-orange-950/60">
                    Skip the cooking, keep the joy. Order your favorite meal and make
                    today delicious.
                </p>
                <a
                    href="menu"
                    className="mt-8 inline-block rounded-full bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700"
                >
                    Start your order <span aria-hidden="true">→</span>
                </a>
            </section>
        </div>
    );
}

export default ReadyForApetite;
