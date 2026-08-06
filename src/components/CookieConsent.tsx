'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineInformationCircle } from 'react-icons/hi';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
        // Trigger a custom event so VisitorTracker knows it can start tracking
        window.dispatchEvent(new Event('cookie-consent-changed'));
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50"
                >
                    <div className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                                <HiOutlineInformationCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Respect de votre vie privée
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                    J’utilise des cookies pour analyser le trafic et améliorer votre expérience sur mon portfolio.
                                    Aucune donnée n’est vendue à des tiers.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors"
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
