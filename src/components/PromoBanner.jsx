import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import './PromoBanner.css';

export default function PromoBanner({ isBannerVisible, setIsBannerVisible }) {
    const { i18n } = useTranslation();
    const [promoContent, setPromoContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPromo() {
            try {
                const { data, error } = await supabase
                    .from('promo_content')
                    .select('*')
                    .eq('is_active', true)
                    .single();

                if (data) {
                    setPromoContent(data);
                } else {
                    setIsBannerVisible(false); // No active promo, hide banner
                }
            } catch (error) {
                console.error("Error fetching promo:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPromo();
    }, [setIsBannerVisible]);

    useEffect(() => {
        // Only update body class if promo is active and visible
        if (promoContent && isBannerVisible) {
            document.body.classList.add('has-promo-banner');
        } else {
            document.body.classList.remove('has-promo-banner');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('has-promo-banner');
        };
    }, [isBannerVisible, promoContent]);

    if (!isBannerVisible) return null;

    const dummyTextEn = "🔥 SPECIAL DEAL: Grab your favorite Zensei meals today with up to 20% discount! Limited time only! 🔥";
    const dummyTextId = "🔥 PROMO SPESIAL: Nikmati hidangan Zensei favoritmu hari ini dengan diskon hingga 20%! Waktu terbatas! 🔥";

    const langCode = i18n.language.startsWith('id') ? 'id' : 'en';
    const textToShow = promoContent ? promoContent[`text_${langCode}`] : (langCode === 'id' ? dummyTextId : dummyTextEn);

    return (
        <div className="promo-banner">
            <div className="promo-banner-content">
                <div className="marquee-container">
                    <div className="marquee-content">
                        {[...Array(10)].map((_, i) => (
                            <span key={`a-${i}`} className="marquee-text">{textToShow}</span>
                        ))}
                    </div>
                    <div className="marquee-content" aria-hidden="true">
                        {[...Array(10)].map((_, i) => (
                            <span key={`b-${i}`} className="marquee-text">{textToShow}</span>
                        ))}
                    </div>
                </div>
                <button
                    className="promo-close-btn"
                    onClick={() => setIsBannerVisible(false)}
                    aria-label="Close promo"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
