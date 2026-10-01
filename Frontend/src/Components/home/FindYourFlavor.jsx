import React from 'react';


const categories = [
    {
        name: "Indian cuisine",
        detail: "Comfort in every bite",
        icon: "🍛",
        color: "bg-orange-100",
        image: "./images/indiancuisine.avif"
    },
    {
        name: "Street favorites",
        detail: "Bold, bright, unforgettable",
        icon: "🌮",
        color: "bg-amber-100",
        image: "./images/streetfood.avif"
    },
    {
        name: "Fresh & light",
        detail: "Goodness made delicious",
        icon: "🥗",
        color: "bg-lime-100",
        image: "./images/freshandlightfood.avif"
    },
    {
        name: "Sweet endings",
        detail: "Save room for dessert",
        icon: "🍰",
        color: "bg-rose-100",
        image: "./images/sweetfood.jpg"
    },
];
const FindYourFlavor = () => {
    return (
        <div>
            <section id="menu" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                            Find your flavor
                        </p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight">
                            What are you craving?
                        </h2>
                    </div>
                    <a
                        href="menu"
                        className="text-sm font-bold text-orange-600 hover:text-orange-800"
                    >
                        View all categories <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <a
                            key={category.name}
                            href={
                                category.name === "Indian cuisine"
                                    ? "/menu?category=Indian%20Cuisine"
                                    : "menu"
                            }
                            className={`group relative flex flex-col overflow-hidden rounded-3xl ${category.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                        >
                            <div className="relative h-44 w-full overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="text-lg font-black tracking-tight text-orange-950">
                                    {category.name}
                                </h3>
                                <p className="mt-1 text-sm text-orange-950/60">
                                    {category.detail}
                                </p>

                                <span
                                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-700 transition-all duration-300 group-hover:gap-3"
                                    aria-hidden="true"
                                >
                                    Explore
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default FindYourFlavor;
