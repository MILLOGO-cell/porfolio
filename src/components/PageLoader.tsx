'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export const PageLoader = () => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Simulate navigation delay for the loader effect

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 z-[9999]"
                />
            )}
        </AnimatePresence>
    );
};
