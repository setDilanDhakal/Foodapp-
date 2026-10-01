import React, { useState, useEffect, useRef } from 'react';
import useCart from '../../context/useCart.js';
import axios from "axios";

const IndianCuisine = ({ category }) => {
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sentItem, setSentItem] = useState("");

    useEffect(() => {
        let ignore = false;

        const fetchCuisine = async () => {
            try {
                const response = await axios.get(`/api/food/getbycategory/${category}`);
                if (!ignore) {
                    setDishes(response.data.data || []);
                }
            } catch (err) {
                if (!ignore) {
                    console.error("Error fetching cuisine", err);
                    setError("Unable to load dishes right now.");
                }
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        fetchCuisine();
        return () => {
            ignore = true;
        };
    }, [category]);

    const { addToCart } = useCart();
    const handleAddToCart = async (dish) => {
        try {
            await addToCart({ foodId: dish._id });
            setSentItem(dish._id);
            window.setTimeout(() => setSentItem(""), 1200);
        } catch (e) {
            console.error('Add to cart failed', e);
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] py-20">
            {/* Decorative blur blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                            {category}
                        </p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight text-orange-950 sm:text-5xl">
                            Rich, warm, unforgettable.
                        </h2>
                        <p className="mt-3 max-w-xl text-orange-950/60">
                            Handpicked dishes made with aromatic spices, slow-cooked flavors,
                            and fresh ingredients — delivered to your door.
                        </p>
                    </div>
                    <a
                        href="menu"
                        className="shrink-0 rounded-full border-2 border-orange-600 px-6 py-3 text-sm font-bold text-orange-700 transition-all duration-300 hover:bg-orange-600 hover:text-white"
                    >
                        Browse full menu <span aria-hidden="true">↗</span>
                    </a>
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="animate-pulse overflow-hidden rounded-3xl bg-white/70 shadow-sm"
                            >
                                <div className="h-52 w-full bg-orange-200/60" />
                                <div className="space-y-3 p-6">
                                    <div className="h-4 w-2/3 rounded bg-orange-200/70" />
                                    <div className="h-3 w-full rounded bg-orange-200/50" />
                                    <div className="h-3 w-5/6 rounded bg-orange-200/50" />
                                    <div className="h-9 w-full rounded-full bg-orange-200/60" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <p className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center font-semibold text-red-700">
                        {error}
                    </p>
                )}

                {/* Empty state */}
                {!isLoading && !error && dishes.length === 0 && (
                    <p className="mt-12 rounded-2xl border border-orange-200 bg-white/70 px-6 py-10 text-center font-semibold text-orange-950/60">
                        No dishes available in this category yet.
                    </p>
                )}

                {/* Grid */}
                {!isLoading && !error && dishes.length > 0 && (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {dishes.map((dish) => (
                            <article
                                key={dish._id}
                                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_25px_rgba(124,45,18,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(124,45,18,0.18)]"
                            >
                                {/* Image */}
                                <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-orange-200 via-amber-300 to-yellow-200">
                                    {dish.image ? (
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-5xl">
                                            🍛
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                                    {/* Availability badge — top-left */}
                                    <span
                                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur ${dish.isAvailable !== false && dish.stock > 0
                                            ? "bg-emerald-500/95 text-white"
                                            : "bg-red-500/95 text-white"
                                            }`}
                                    >
                                        {dish.isAvailable !== false && dish.stock > 0
                                            ? "Available"
                                            : "Sold out"}
                                    </span>

                                    {/* Prep time badge — top-right */}
                                    {dish.preparationTime && (
                                        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700 shadow-sm backdrop-blur">
                                            ⏱ {dish.preparationTime} min
                                        </span>
                                    )}

                                    {/* Price — bottom-left, overlapping */}
                                    <span className="absolute top-42 right-5 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-lg ring-1 ring-emerald-100">
                                        रु {Number(dish.price).toLocaleString()}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col px-6 pb-6 pt-8">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-black leading-tight tracking-tight text-orange-950">
                                            {dish.name}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-950">
                                            <span className="text-amber-400">★★★★★</span>
                                            5.0
                                        </span>
                                    </div>

                                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-orange-950/60">
                                        {dish.description.slice(0,70)}...
                                    </p>



                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-between border-t border-dashed border-orange-100 pt-4">
                                        <button className='rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30'>
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            disabled={dish.isAvailable === false || dish.stock <= 0}
                                            onClick={() => handleAddToCart(dish)}
                                            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${sentItem === dish._id
                                                ? "bg-green-600 text-white"
                                                : dish.isAvailable === false || dish.stock <= 0
                                                    ? "cursor-not-allowed bg-orange-100 text-orange-950/40"
                                                    : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30"
                                                }`}
                                        >
                                            {sentItem === dish._id
                                                ? "Sent ✓"
                                                : dish.isAvailable === false || dish.stock <= 0
                                                    ? "Unavailable"
                                                    : "Add to order +"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default IndianCuisine;