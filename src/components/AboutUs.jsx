import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import './AboutUs.css';

export default function AboutUs() {
    const { t, i18n } = useTranslation();
    const [slides, setSlides] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const [isFirstRender, setIsFirstRender] = useState(true);

    const slideDuration = 5000; // 5 seconds per slide

    useEffect(() => {
        if (slides.length > 0) {
            // Need a tiny timeout to let the first render settle without animation
            setTimeout(() => setIsFirstRender(false), 100);
        }
    }, [slides]);

    useEffect(() => {
        async function fetchSlides() {
            try {
                const { data, error } = await supabase
                    .from('about_slides')
                    .select('*')
                    .order('order_num', { ascending: true });

                if (error) throw error;
                if (data) setSlides(data);
            } catch (error) {
                console.error("Error fetching about slides:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSlides();
    }, []);

    // Timer logic for auto-advance and progress bar
    useEffect(() => {
        if (slides.length <= 1) return;

        let interval;
        let p = 0;
        const tickRate = 50; // Update progress every 50ms for smoothness

        interval = setInterval(() => {
            p += (tickRate / slideDuration) * 100;
            if (p >= 100) {
                p = 0;
                setActiveIndex((prev) => (prev + 1) % slides.length);
            }
            setProgress(p);
        }, tickRate);

        return () => clearInterval(interval);
    }, [activeIndex, slides.length]); // Reset timer when slide changes manually or automatically

    const handleTabClick = (index) => {
        setActiveIndex(index);
        setProgress(0); // Reset progress bar when manually clicked
    };

    if (loading) {
        return <section className="about-section loading">Loading...</section>;
    }

    if (!slides || slides.length === 0) {
        return null;
    }

    const langCode = i18n.language.startsWith('id') ? 'id' : 'en';
    const activeSlide = slides[activeIndex];

    return (
        <section className="about-section" id="about">
            <div className="container about-container">
                {/* Header text */}
                <div className="about-header text-center">
                    <h2>{t('about.heading')}</h2>
                    <p>{t('about.desc').split(', ').map((str, index, array) => (
                        <React.Fragment key={index}>
                            {str}{index !== array.length - 1 ? ', ' : ''}
                            {index === 1 && <br />}
                        </React.Fragment>
                    ))}</p>
                </div>

                {/* Navigation Tabs */}
                <div className="about-tabs-wrapper">
                    <div className="about-tabs">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                className={`about-tab-btn ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => handleTabClick(index)}
                            >
                                {slide[`nav_title_${langCode}`]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Slider Card */}
                <div className="about-card-wrapper">
                    <div className="about-card-container">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={activeIndex}
                                className="about-card"
                                initial={isFirstRender ? false : { x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {/* Left Side: Image */}
                                <div className="about-image-wrapper">
                                    <img
                                        src={activeSlide.image_url}
                                        alt={activeSlide[`heading_${langCode}`]}
                                        className="about-image"
                                    />
                                </div>

                                {/* Right Side: Text & Progress */}
                                <div className="about-content">
                                    <div className="about-content-inner">
                                        <span className="about-nav-label">{activeSlide[`nav_title_${langCode}`]}</span>
                                        <h3>{activeSlide[`heading_${langCode}`]}</h3>
                                        <p className="about-desc">
                                            {activeSlide[`paragraph_${langCode}`].split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    </div>

                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Bars Indicator Track - moved outside of AnimatePresence to be static */}
                        <div className="about-progress-track-wrapper">
                            <div className="about-progress-tracks">
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`progress-track ${idx < activeIndex ? 'completed' : ''} ${idx === activeIndex ? 'active' : ''}`}
                                        onClick={() => handleTabClick(idx)}
                                    >
                                        {idx === activeIndex && (
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
