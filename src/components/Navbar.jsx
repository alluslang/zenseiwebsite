import React, { useState } from 'react';
import { ChevronRight, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActionButtons } from '../lib/useActionButtons';
import './Navbar.css';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const { t, i18n } = useTranslation();
    const { buttons } = useActionButtons();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('id') ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="navbar-container container">
            <div
                className="navbar-pill"
                onMouseEnter={() => setIsNavHovered(true)}
                onMouseLeave={() => setIsNavHovered(false)}
            >

                <div className="nav-links">
                    <a href="#product" className="nav-link">{t('navbar.product')}</a>
                    <a href="#about" className="nav-link">{t('navbar.about_us')}</a>
                    <a href="#instagram" className="nav-link">{t('navbar.social_media')}</a>
                </div>

                <div className="nav-logo">
                    <img
                        src={isNavHovered ? "/zenseired.svg" : "/zenseired.svg"}
                        alt="Zensei Logo"
                        className="logo-image"
                    />
                </div>

                {/* Mobile Hamburger Toggle & Lang */}
                <div className="mobile-toggle-wrapper">
                    <button className="btn lang-toggle" onClick={toggleLanguage} aria-label="Toggle Language" style={{ padding: '0.25rem' }}>
                        <Globe size={18} style={{ marginRight: '4px' }} />
                        <span>{i18n.language.toUpperCase().startsWith('ID') ? 'ID' : 'EN'}</span>
                    </button>
                    <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu" style={{ marginLeft: '1rem' }}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="nav-actions">
                    <button className="btn lang-toggle" onClick={toggleLanguage} aria-label="Toggle Language">
                        <Globe size={18} />
                        <span>{i18n.language.toUpperCase().startsWith('ID') ? 'ID' : 'EN'}</span>
                    </button>
                    <a href={buttons.join_partnership} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                        {t('navbar.join_partnership')}
                        <span className="btn-icon">
                            <ChevronRight size={14} />
                        </span>
                    </a>
                </div>

            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>

                <a href="#product" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.product')}</a>
                <a href="#about" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.about_us')}</a>
                <a href="#instagram" className="mobile-nav-link" onClick={toggleMobileMenu}>{t('navbar.social_media')}</a>
                <div className="mobile-menu-actions">
                    <a href={buttons.join_partnership} target="_blank" rel="noopener noreferrer" className="btn btn-dark mobile-btn">{t('navbar.join_partnership')}</a>
                    <a href={buttons.online_order} target="_blank" rel="noopener noreferrer" className="btn btn-white mobile-btn">
                        {t('navbar.online_order')}
                        <span className="btn-icon">
                            <ChevronRight size={14} />
                        </span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
