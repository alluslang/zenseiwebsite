import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PromoBanner from '../components/PromoBanner';

const Products = lazy(() => import('../components/Products'));
const AboutUs = lazy(() => import('../components/AboutUs'));
const InstagramFeed = lazy(() => import('../components/InstagramFeed'));
const Footer = lazy(() => import('../components/Footer'));

export default function Landing() {
    const [isLoading, setIsLoading] = useState(true);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    useEffect(() => {
        // Simulate initial loading time for visual effect (min 2s)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading && (
                <div className="fullscreen-loader">
                    <img src="/zlogo_white.svg" alt="Zensei Loading..." className="loader-logo" />
                </div>
            )}
            <PromoBanner isBannerVisible={isBannerVisible} setIsBannerVisible={setIsBannerVisible} />
            <Navbar />
            <main>
                <Hero />
                <Suspense fallback={null}>
                    <Products />
                    <AboutUs />
                    <InstagramFeed />
                </Suspense>
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
}
