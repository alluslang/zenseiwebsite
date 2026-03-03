import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <img src="/zlogo_white.svg" alt="Zensei Logo" className="footer-logo" />
                        <p className="footer-desc">
                            Lebih dari sekadar satu hidangan. Nikmati sensasi sei sapi dan ayam asap premium dengan aneka sambal Nusantara.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="footer-links">
                        <h4>Menu Navigasi</h4>
                        <ul>
                            <li><a href="#product">Produk</a></li>
                            <li><a href="#about">Tentang Kami</a></li>
                            <li><a href="#social">Sosial Media</a></li>
                            <li><a href="#location">Lokasi</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-contact">
                        <h4>Hubungi Kami</h4>
                        <ul>
                            <li>
                                <MapPin size={18} />
                                <span>Jl. R.E. Martadinata No.61, Bandung</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <a href="tel:+6281234567890">+62 812-3456-7890</a>
                            </li>
                            <li>
                                <Mail size={18} />
                                <a href="mailto:hello@zensei.co.id">hello@zensei.co.id</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Zensei Indonesia. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
