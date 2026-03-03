import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [isNavHidden, setIsNavHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide navbar if scrolling down and past the top area (e.g. 50px)
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsNavHidden(true);
            } else {
                // Show navbar if scrolling up
                setIsNavHidden(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('id') ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className={`navbar-container container ${isNavHidden ? 'nav-hidden' : ''}`}>
            <div
                className="navbar-pill"
                onMouseEnter={() => setIsNavHovered(true)}
                onMouseLeave={() => setIsNavHovered(false)}
            >

                <div className="nav-links">
                    <a href="#product" className="nav-link">{t('navbar.product')}</a>
                    <a href="#about" className="nav-link">{t('navbar.about_us')}</a>
                    <a href="#news" className="nav-link">{t('navbar.news')}</a>
                    <a href="#location" className="nav-link">{t('navbar.location')}</a>
                </div>

                <div className="nav-logo">
                    <img
                        src={isNavHovered ? "/zenseired.svg" : "/zenseired.svg"}
                        alt="Zensei Logo"
                        className="logo-image"
                    />
                </div>

                {/* Mobile Hamburger Toggle */}
                <div className="mobile-toggle-wrapper">
                    <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="nav-actions">
                    <button className="btn lang-toggle" onClick={toggleLanguage} aria-label="Toggle Language">
                        <Globe size={18} />
                        <span>{i18n.language.toUpperCase().startsWith('ID') ? 'ID' : 'EN'}</span>
                    </button>
                    <button className="btn btn-dark">
                        {t('navbar.join_partnership')}
                        <span className="btn-icon">
                            <ChevronRight size={14} />
                        </span>
                    </button>
                </div>

            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>

                {/* Mobile Lang Switcher */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
                    <button className="btn lang-toggle" onClick={toggleLanguage}>
                        <Globe size={18} />
                        <span>{i18n.language.toUpperCase().startsWith('ID') ? 'ID' : 'EN'}</span>
                    </button>
                </div>

                <a href="#product" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.product')}</a>
                <a href="#about" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.about_us')}</a>
                <a href="#news" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.news')}</a>
                <a href="#location" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.location')}</a>
                <div className="mobile-menu-actions">
                    <button className="btn btn-dark mobile-btn">{t('navbar.join_partnership')}</button>
                    <button className="btn btn-white mobile-btn">
                        {t('navbar.online_order')}
                        <span className="btn-icon">
                            <ChevronRight size={14} />
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
