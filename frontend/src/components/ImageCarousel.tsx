import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Car } from 'lucide-react';
import api from '../lib/api';

interface ImageCarouselProps {
    images: { id: number; url: string; isPrimary: boolean }[];
    autoPlay?: boolean;
    interval?: number;
}

export default function ImageCarousel({ images, autoPlay = true, interval = 3000 }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sortedImages = [...(images || [])].sort((a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1));

    useEffect(() => {
        if (!autoPlay || sortedImages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, sortedImages.length, interval]);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    if (!sortedImages.length) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <Car className="w-16 h-16 text-slate-700" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 group/carousel overflow-hidden bg-black">
            {sortedImages.map((img, index) => (
                <div
                    key={img.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <img
                        src={`${api.defaults.baseURL?.replace('/api', '')}${img.url}`}
                        alt="Vehicle"
                        className="w-full h-full object-cover group-hover/carousel:scale-110 transition-transform duration-700"
                    />
                </div>
            ))}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />

            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/30 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-black/50 backdrop-blur-sm transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/30 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-black/50 backdrop-blur-sm transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/30 backdrop-blur-md">
                        {sortedImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-teal-400' : 'w-1.5 bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
