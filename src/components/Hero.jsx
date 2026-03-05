import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActionButtons } from '../lib/useActionButtons';
import { useTheme } from '../context/ThemeContext';
import SectionDivider from './SectionDivider';
import './Hero.css';

export default function Hero() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();
    const { buttons } = useActionButtons();
    const { themes, getBackgroundStyle } = useTheme();

    // Helper to get the correct column based on active language (e.g., 'en' or 'id')
    const getLocalizedField = (fieldName) => {
        const langCode = i18n.language.startsWith('id') ? 'id' : 'en';
        return content ? content[`${fieldName}_${langCode}`] : '';
    };

    useEffect(() => {
        async function fetchHeroContent() {
            try {
                const { data, error } = await supabase
                    .from('hero_content')
                    .select('*')
                    .single();

                if (error) throw error;
                if (data) setContent(data);
            } catch (error) {
                console.error('Error fetching hero content:', error);
                setFetchError(error.message || 'Unknown error fetching data');
            } finally {
                setLoading(false);
            }
        }

        fetchHeroContent();
    }, []);

    if (loading) {
        return (
            <section className="hero-section" style={{ ...getBackgroundStyle(themes.hero), backgroundColor: themes.hero?.color || 'var(--color-primary)' }}>
                <div className="hero-loading">
                    <img src="/zlogo_white.svg" alt="Loading Zensei..." className="loading-logo" />
                </div>
            </section>
        );
    }

    if (fetchError) {
        return <div className="hero-loading">Error: {fetchError}</div>;
    }

    if (!content) {
        return <div className="hero-loading">No content found.</div>;
    }

    // Animation variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const floatAnimation = {
        y: [0, -15, 0],
        rotate: [0, 2, -2, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <section className="hero-section" style={getBackgroundStyle(themes.hero)}>
            <div className="container">
                <div className="hero-grid">

                    {/* Left Content */}
                    <motion.div
                        className="hero-content-left"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div className="hero-badge" variants={fadeUp}>
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="white" color="white" />
                                ))}
                            </div>
                            <span className="badge-text">{getLocalizedField('badge_text')}</span>
                        </motion.div>

                        <motion.h1 className="heading-display" variants={fadeUp}>
                            {getLocalizedField('heading')}
                        </motion.h1>

                        <motion.p className="text-lead" variants={fadeUp}>
                            {getLocalizedField('subheading')}
                        </motion.p>

                        <motion.div className="hero-actions" variants={fadeUp}>
                            <a href={buttons.hero_primary} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                {getLocalizedField('primary_button_text')}
                                <span className="btn-icon">
                                    <ArrowUpRight size={14} />
                                </span>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right Content / Image (Restored) */}
                    <div className="hero-content-right">
                        <motion.div
                            className="hero-image-wrapper"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.img
                                src={content.image_url}
                                alt="Zensei Hero Product"
                                className="hero-image"
                                fetchPriority="high"
                                decoding="async"
                                animate={floatAnimation}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Dynamic Section Divider */}
            {themes.hero?.show_divider && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <SectionDivider color={themes.products?.color || '#ffffff'} />
                </div>
            )}
        </section>
    );
}
