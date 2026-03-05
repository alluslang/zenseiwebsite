import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import SectionDivider from './SectionDivider';
import './PromoSection.css';

export default function PromoSection() {
    const [promo, setPromo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { themes, getBackgroundStyle } = useTheme();

    useEffect(() => {
        const fetchPromo = async () => {
            const { data, error } = await supabase
                .from('promo_sections')
                .select('*')
                .eq('is_active', true)
                .limit(1)
                .maybeSingle();

            if (data && !error) {
                setPromo(data);
            }
            setLoading(false);
        };

        fetchPromo();
    }, []);

    if (loading) return null; // Don't show anything while loading
    if (!promo) return null; // Or if no active promo

    const langCode = i18n.language.startsWith('id') ? 'id' : 'en';

    // Retrieve translated fields
    const title = promo[`title_${langCode}`];
    const description = promo[`description_${langCode}`];
    const buttonText = promo[`button_text_${langCode}`];

    return (
        <section className="promo-section-block" style={{ position: 'relative', ...getBackgroundStyle(themes.promo) }}>
            <div className="container promo-section-container">
                <motion.div
                    className="promo-image-wrapper"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <img src={promo.image_url} alt={title} className="promo-main-image" />
                </motion.div>

                <motion.div
                    className="promo-content-wrapper"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="promo-badge">
                        <span className="badge-pulse"></span>
                        {langCode === 'id' ? 'Promo Spesial' : 'Special Offer'}
                    </div>

                    <h2 className="promo-title">{title}</h2>
                    <p className="promo-desc">{description}</p>

                    {buttonText && promo.button_url && (
                        <a href={promo.button_url} target="_blank" rel="noopener noreferrer" className="promo-cta-btn">
                            {buttonText}
                        </a>
                    )}
                </motion.div>
            </div>

            {/* Dynamic Section Divider */}
            {themes.promo?.show_divider && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <SectionDivider color={themes.about?.color || '#ffffff'} shape={themes.promo?.divider_shape || 'wave'} />
                </div>
            )}
        </section>
    );
}
