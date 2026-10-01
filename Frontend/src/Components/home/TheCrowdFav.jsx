import { useState } from 'react';
import useCart from '../../context/useCart.js';
const popularDishes = [
    {
        _id: "crowd-1",
        name: "Tandoori Butter Bowl",
        description: "Charred paneer, makhani sauce, basmati rice",
        price: "रु 1,806",
        rating: "4.9",
        color: "from-orange-300 to-red-400",
        image: "/images/TandooriButterBowl.jpg",
    },
    {
        _id: "crowd-2",
        name: "Crispy Masala Wrap",
        description: "Spiced potato, fresh slaw, mint chutney",
        price: "रु 1,330",
        rating: "4.8",
        color: "from-amber-200 to-orange-400",
        image: "/images/CrispyMasalaWrap.avif",
    },
    { _id: "crowd-3",
        name: "Mango Cloud Lassi",
        description: "Alphonso mango, yogurt, cardamom",
        price: "रु 735",
        rating: "5.0",
        color: "from-yellow-200 to-amber-300",
        image: "/images/MangoCloudLassi.jpg",
    },
];

function Stars({ value = "5.0" }) {
    return (
        <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`h-4 w-4 ${Number(value) > i ? "text-amber-400" : "text-orange-100"
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

const TheCrowdFav = () => {
    const [sentItem, setSentItem] = useState("");
    const [isLoadingDishes, setIsLoadingDishes] = useState(true);
    const { addToCart } = useCart();
    const handleAddToCart = async (dish) => {
        try {
            await addToCart({ foodId: dish._id });
            setSentItem(dish._id);
        }
        catch(e) {
        console.error('Add to cart failed', e);
    }
};
return (
    <div>
        <section className="bg-orange-950 py-20 text-orange-50">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
                            The crowd favorites
                        </p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight text-white">
                            Good taste, confirmed.
                        </h2>
                    </div>
                    <a
                        href="menu"
                        className="text-sm font-bold text-orange-300 hover:text-white"
                    >
                        Browse full menu <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <div className="mt-10 grid gap-5 lg:grid-cols-3">
                    {popularDishes.map((dish, index) => (
                        <article
                            key={index}
                            className="group relative overflow-hidden rounded-3xl bg-white text-orange-950 shadow-[0_10px_30px_rgba(124,45,18,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(124,45,18,0.15)]"
                        >
                            {/* Image */}
                            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-200 via-amber-300 to-yellow-200">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Bottom gradient for the price tag readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                {/* Rating badge — top-left */}
                                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-orange-950 shadow-sm backdrop-blur">
                                    <span className="text-amber-400">★</span>
                                    5.0
                                </span>

                                {/* Price tag — bottom-right, on the image */}
                                <span className="absolute bottom-4 right-4 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-black text-white shadow-lg shadow-emerald-900/20">
                                    रु {Number(dish.price).toLocaleString()}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-black tracking-tight">{dish.name}</h3>

                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-orange-950/60">
                                    {dish.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-5">
                                    <Stars />

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(dish)}
                                        className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${sentItem === dish._id ? "bg-green-600 text-white" : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30"}`}
                                    >
                                        {sentItem === dish._id ? "Sent ✓" : "Add to order +"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                    {!isLoadingDishes && popularDishes.length === 0 && (
                        <p className="py-10 text-center text-orange-100/70 lg:col-span-3">No food items are available yet.</p>
                    )}
                </div>
            </div>
        </section>
    </div>
);
}

export default TheCrowdFav;
