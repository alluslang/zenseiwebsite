import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import './InstagramFeed.css';

export default function InstagramFeed() {
    useEffect(() => {
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
            </div>
        </section>
    );
}
