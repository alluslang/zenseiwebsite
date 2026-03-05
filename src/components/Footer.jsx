import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import './Footer.css';

export default function Footer() {
    const { t, i18n } = useTranslation();
    const [footerData, setFooterData] = useState({
        description: 'Lebih dari sekadar satu hidangan. Nikmati sensasi sei sapi dan ayam asap premium dengan aneka sambal Nusantara.',
        description_en: 'More than just a meal. Enjoy the sensation of premium smoked beef and chicken with a variety of Nusantara sambals.',
        address: 'Jl. R.E. Martadinata No.61, Bandung',
        address_en: '61 R.E. Martadinata St, Bandung',
        phone: '+62 812-3456-7890',
        email: 'hello@zensei.co.id'
    });

    const { logos, themes, getBackgroundStyle } = useTheme();

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const { data, error } = await supabase
                    .from('footer_content')
                    .select('*')
                    .limit(1)
                    .single();

                if (data && !error) {
                    setFooterData(data);
                }
            } catch (err) {
                // Silently fallback to default data if table doesn't exist yet
                console.log('Using default footer data.');
            }
        };

        fetchFooterData();
    }, []);
    const currentLang = i18n.language; // 'id' or 'en'

    return (
        <footer className="footer-section" style={{ position: 'relative', ...getBackgroundStyle(themes.footer) }}>
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <img src={logos?.footer || "/zlogo_dark.svg"} alt="Zensei Logo" className="footer-logo" />
                        <p className="footer-desc">
                            {currentLang === 'en' && footerData.description_en ? footerData.description_en : footerData.description}
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="footer-links">
                        <h4>{t('footer.nav_menu')}</h4>
                        <ul>
                            <li><a href="#product">{t('navbar.product')}</a></li>
                            <li><a href="#about">{t('navbar.about_us')}</a></li>
                            <li><a href="#instagram">{t('navbar.social_media')}</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-contact">
                        <h4>{t('footer.contact_us')}</h4>
                        <ul>
                            <li>
                                <MapPin size={18} />
                                <span>{currentLang === 'en' && footerData.address_en ? footerData.address_en : footerData.address}</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <a href={`tel:${footerData.phone}`}>{footerData.phone}</a>
                            </li>
                            <li>
                                <Mail size={18} />
                                <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {t('footer.rights_reserved')}</p>
                </div>
            </div>
        </footer>
    );
}
