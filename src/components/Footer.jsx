import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Footer.css';

export default function Footer() {
    const [footerData, setFooterData] = useState({
        description: 'Lebih dari sekadar satu hidangan. Nikmati sensasi sei sapi dan ayam asap premium dengan aneka sambal Nusantara.',
        address: 'Jl. R.E. Martadinata No.61, Bandung',
        phone: '+62 812-3456-7890',
        email: 'hello@zensei.co.id'
    });

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
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <img src="/zenseired.svg" alt="Zensei Logo" className="footer-logo" />
                        <p className="footer-desc">
                            {footerData.description}
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="footer-links">
                        <h4>Menu Navigasi</h4>
                        <ul>
                            <li><a href="#product">Produk</a></li>
                            <li><a href="#about">Tentang Kami</a></li>
                            <li><a href="#instagram">Sosial Media</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-contact">
                        <h4>Hubungi Kami</h4>
                        <ul>
                            <li>
                                <MapPin size={18} />
                                <span>{footerData.address}</span>
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
                    <p>&copy; {new Date().getFullYear()} Zensei Indonesia. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
