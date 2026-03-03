import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AboutUs.css';

export default function AboutUs() {
    const { t, i18n } = useTranslation();
    const [slides, setSlides] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

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
            if (!isPlaying) return; // Freeze progress if paused
            p += (tickRate / slideDuration) * 100;
            if (p >= 100) {
                p = 0;
                setActiveIndex((prev) => (prev + 1) % slides.length);
            }
            setProgress(p);
        }, tickRate);

        return () => clearInterval(interval);
    }, [activeIndex, slides.length, isPlaying]); // Reset timer when slide changes manually, automatically, or play state changes

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
                <motion.div
                    className="about-header text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2>{t('about.heading')}</h2>
                    <p>{t('about.desc').split(', ').map((str, index, array) => (
                        <React.Fragment key={index}>
                            {str}{index !== array.length - 1 ? ', ' : ''}
                            {index === 1 && <br />}
                        </React.Fragment>
                    ))}</p>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    className="about-tabs-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                >
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
                </motion.div>

                {/* Slider Card */}
                <motion.div
                    className="about-card-wrapper"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.2, delay: 0.2 }}
                >
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
                                <button className="about-play-btn" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause slider" : "Play slider"}>
                                    {isPlaying ? <Pause size={16} color="var(--color-black)" fill="var(--color-black)" /> : <Play size={16} color="var(--color-black)" fill="var(--color-black)" />}
                                </button>
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`progress-track ${idx < activeIndex ? 'completed' : ''} ${idx === activeIndex ? 'active' : ''}`}
                                        onClick={() => {
                                            handleTabClick(idx);
                                            setIsPlaying(true); // Auto-resume on manual click
                                        }}
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
                </motion.div>
            </div>
        </section>
    );
}
