import React from 'react';
import { Instagram, Youtube, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './SocialLinks.css';

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

const socialLinks = [
    {
        id: 1,
        platform: 'Instagram',
        url: 'https://www.instagram.com/zensei.id',
        icon: <Instagram size={24} />
    },
    {
        id: 2,
        platform: 'TikTok',
        url: 'https://www.tiktok.com/@zensei.id',
        icon: <TikTokIcon size={24} />
    },
    {
        id: 3,
        platform: 'YouTube',
        url: 'https://www.youtube.com/',
        icon: <Youtube size={24} />
    },
    {
        id: 4,
        platform: 'WhatsApp',
        url: 'https://wa.me/6281234567890',
        icon: <MessageCircle size={24} />
    },
    {
        id: 5,
        platform: 'Email',
        url: 'mailto:hello@zensei.co.id',
        icon: <Mail size={24} />
    }
];

export default function SocialLinks() {
    return (
        <section className="social-links-section" id="social">
            <div className="container">
                <motion.div
                    className="social-links-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="social-links-title">Connect With Us</h3>
                    <div className="social-icons-wrapper">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon-box"
                                aria-label={`Visit our ${link.platform}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {link.icon}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
