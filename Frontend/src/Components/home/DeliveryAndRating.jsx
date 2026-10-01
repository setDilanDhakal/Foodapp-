import React from 'react';
import { useState, useEffect } from 'react';
function AnimatedMetric({ value, suffix = "", decimals = 0 }) {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        const duration = 1200;
        const startTime = performance.now();
        let animationFrame;

        const animate = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const easedProgress = 1 - (1 - progress) ** 3;
            setCurrentValue(value * easedProgress);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [value]);

    return (
        <span aria-label={`${value}${suffix}`}>
            {currentValue.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    );
}

const DeliveryAndRating = () => {
    return (
        <div>
            <section
                aria-label="Bhoj Express highlights"
                className="border-b border-orange-100 bg-white"
            >
                <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 lg:px-8">
                    {[
    
                        [2000, "+", "orders delivered"],
                        [4.9, " / 5", "average rating", 1],
                        [30, " min", "to your doorstep"],
                
                    ].map(([value, suffix, label, decimals = 0]) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 border-orange-100 sm:border-r sm:last:border-0"
                        >
                            <span className="text-2xl font-black text-orange-600">
                                {value}{suffix}
                            </span>
                            <span className="text-sm text-orange-950/60">{label}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default DeliveryAndRating;
