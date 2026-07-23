import { useState, useEffect } from 'react';

interface Props {
    images: string[];
    className?: string;
    showDots?: boolean;
}

export default function ImageSlideshow({ images, className = "", showDots = false }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images]);

    if (images.length === 0) return null;

    return (
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
            />
            {/* Dots navigation if more than 1 image and showDots is true */}
            {showDots && images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
