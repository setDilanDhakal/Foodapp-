import React from 'react';
import { useState, useRef } from 'react';

const handlePrev = () => {
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
};



const reviews = [
    {
        quote:
            "The kind of meal that makes a busy Tuesday feel like a celebration.",
        name: "Maya R.",
        detail: "Regular customer",
        initials: "MR",
    },
    {
        quote:
            "Everything arrived warm, beautifully packed, and somehow even tastier than expected.",
        name: "Jonah K.",
        detail: "Verified order",
        initials: "JK",
    },
    {
        quote:
            "Bhoj Express is now our Friday night ritual. The butter bowl is genuinely excellent.",
        name: "Aisha T.",
        detail: "Verified order",
        initials: "AT",
    },
    {
        quote:
            "The flavors are bright, comforting, and exactly what I wanted after a long day.",
        name: "Ravi S.",
        detail: "Verified order",
        initials: "RS",
    },
    {
        quote:
            "Fast delivery, generous portions, and the friendliest service in the neighborhood.",
        name: "Nina P.",
        detail: "Regular customer",
        initials: "NP",
    },
    {
        quote:
            "I found my new favorite lunch spot without leaving my desk. Absolutely delightful.",
        name: "Leo M.",
        detail: "Verified order",
        initials: "LM",
    },
];


const handleNext = () => {
    if (activeIndex < reviews.length - 1) scrollToIndex(activeIndex + 1);
};


const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / reviews.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(index);
};

const KindWords = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div>
            <section
                id="reviews"
                className="border-y border-orange-200 bg-orange-100"
            >
                <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
                                Kind words
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                The reviews are in.
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-orange-950/65">
                                A few notes from the people who keep us cooking. Every rating
                                helps us make the next order even better.
                            </p>
                            <div className="mt-5 flex items-center gap-3">
                                <span className="text-3xl font-black">4.9</span>
                                <div>
                                    <div
                                        className="text-sm tracking-widest text-amber-400"
                                        aria-label="5 out of 5 stars"
                                    >
                                        ★★★★★
                                    </div>
                                    <p className="text-xs text-orange-950/50">2,000+ reviews</p>
                                </div>
                            </div>
                        </div>
                        <a
                            href="contact"
                            className="w-fit rounded-full border-2 border-orange-600 px-7 py-3.5 text-sm font-bold text-orange-700 hover:bg-orange-600 hover:text-white"
                        >
                            Leave feedback <span aria-hidden="true">↗</span>
                        </a>
                    </div>

                    {/* Swipeable reviews with side arrows */}
                    <div className="mt-10 flex items-center gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={activeIndex === 0}
                            aria-label="Previous review"
                            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl text-orange-600 shadow-md transition hover:bg-orange-50 disabled:opacity-30 disabled:hover:bg-white sm:flex"
                        >
                            ←
                        </button>

                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {reviews.map((review, index) => (
                                <figure
                                    key={`${review.name}-${index}`}
                                    className="flex h-full w-[85%] flex-none snap-start flex-col rounded-2xl border border-orange-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-md sm:w-[48%] lg:w-[calc((100%-3rem)/4)]"
                                >
                                    <div
                                        className="text-sm tracking-widest text-amber-400"
                                        aria-label="5 out of 5 stars"
                                    >
                                        ★★★★★
                                    </div>
                                    <blockquote className="mt-4 flex-1 text-sm font-bold leading-6 text-orange-950">
                                        “{review.quote}”
                                    </blockquote>
                                    <figcaption className="mt-4 flex items-center gap-3 border-t border-orange-100 pt-4">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 text-xs font-black text-orange-800">
                                            {review.initials}
                                        </span>
                                        <span>
                                            <strong className="block text-sm">{review.name}</strong>
                                            <span className="text-xs text-orange-950/50">
                                                {review.detail}
                                            </span>
                                        </span>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={activeIndex === reviews.length - 1}
                            aria-label="Next review"
                            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl text-orange-600 shadow-md transition hover:bg-orange-50 disabled:opacity-30 disabled:hover:bg-white sm:flex"
                        >
                            →
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default KindWords;
