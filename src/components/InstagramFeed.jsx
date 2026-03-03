import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Mail, MessageCircle, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './InstagramFeed.css';

// TikTok doesn't have a standard icon in lucide-react, using a custom SVG for it
const TikTokIcon = ({ size = 24, color = "currentColor" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
);

// Define an icon map to convert string names from DB to actual components
const iconMap = {
    'Instagram': (props) => <Instagram {...props} />,
    'Youtube': (props) => <Youtube {...props} />,
    'MessageCircle': (props) => <MessageCircle {...props} />,
    'Mail': (props) => <Mail {...props} />,
    'Music': (props) => <TikTokIcon {...props} /> // Fallback TikTok to Music icon string
};

export default function InstagramFeed() {
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        // Fetch CMS Social Links
        const fetchSocialLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from('social_links')
                    .select('*')
                    .order('order_num', { ascending: true });

                if (data && !error) {
                    setSocialLinks(data);
                } else if (error) {
                    console.error("Error fetching social links:", error);
                }
            } catch (err) {
                console.error("Failed to fetch social links", err);
            }
        };

        fetchSocialLinks();

        // Dynamically inject the Elfsight script on mount
        if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
            const script = document.createElement('script');
            script.src = "https://elfsightcdn.com/platform.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <section className="instagram-section" id="instagram">
            <div className="container">
                <motion.div
                    className="instagram-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="instagram-icon-wrapper">
                        <Instagram size={32} color="var(--color-primary)" />
                    </div>
                    <h2>Follow Us @zensei.id</h2>
                    <p>Share your moments and stay updated with our latest offerings.</p>
                </motion.div>

                {/* Elfsight Widget Container */}
                <motion.div
                    className="instagram-feed-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <div className="elfsight-app-decf41a6-07f5-4770-9e10-b542c1373434" data-elfsight-app-lazy></div>
                </motion.div>

                {/* Integrated Social Links */}
                <motion.div
                    className="integrated-social-links"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {socialLinks.length > 0 && (
                        <>
                            <p className="social-links-text">Temukan kami juga di platform lainnya:</p>
                            <div className="integrated-social-icons">
                                {socialLinks.map((link, index) => {
                                    const IconComponent = iconMap[link.icon_name] || iconMap['Instagram']; // Fallback icon
                                    return (
                                        <motion.a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="integrated-social-icon"
                                            aria-label={`Visit our ${link.platform_name}`}
                                            style={{ '--hover-color': link.color }}
                                            whileHover={{ y: -5, scale: 1.15 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                                        >
                                            <IconComponent size={28} />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
