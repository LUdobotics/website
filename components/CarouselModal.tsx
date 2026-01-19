import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import sneak1 from '../assets/sneak1.jpg';
import sneak2 from '../assets/sneak2.jpg';
import sneak3 from '../assets/sneak3.jpg';

interface CarouselModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const images = [sneak1, sneak2, sneak3];

export const CarouselModal: React.FC<CarouselModalProps> = ({ isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#020810]/95 backdrop-blur-md z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-5xl pointer-events-auto relative"
                        >
                            <div className="relative aspect-video bg-black/50 rounded-2xl overflow-hidden border border-ludo-cyan/30 shadow-[0_0_50px_rgba(0,255,255,0.15)]">

                                {/* Images */}
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentIndex}
                                        src={images[currentIndex]}
                                        alt={`Sneak Peek ${currentIndex + 1}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full object-contain"
                                    />
                                </AnimatePresence>

                                {/* Controls */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-ludo-cyan/20 p-2 rounded-full transition-all z-20"
                                >
                                    <X size={24} />
                                </button>

                                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                    <button
                                        onClick={prevImage}
                                        className="pointer-events-auto p-4 md:p-6 text-white/70 hover:text-ludo-cyan hover:scale-110 transition-all filter drop-shadow hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                                    >
                                        <ChevronLeft size={48} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="pointer-events-auto p-4 md:p-6 text-white/70 hover:text-ludo-cyan hover:scale-110 transition-all filter drop-shadow hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                                    >
                                        <ChevronRight size={48} />
                                    </button>
                                </div>

                                {/* Indicators */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentIndex(idx);
                                            }}
                                            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex
                                                    ? 'bg-ludo-cyan w-8'
                                                    : 'bg-white/30 hover:bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
