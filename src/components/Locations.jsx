import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './Locations.css';

const branches = [
    {
        id: 1,
        name: 'Zensei Bandung (Pusat)',
        address: 'Jl. R.E. Martadinata No.61, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
        mapUrl: 'https://maps.app.goo.gl/1V2kP6XN1Xm4F5N8A'
    },
    {
        id: 2,
        name: 'Zensei Buah Batu',
        address: 'Jl. Buah Batu No.123, Turangga, Kec. Lengkong, Kota Bandung, Jawa Barat 40265',
        mapUrl: 'https://maps.app.goo.gl/dummy'
    },
    {
        id: 3,
        name: 'Zensei Setiabudi',
        address: 'Jl. Dr. Setiabudi No.45, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161',
        mapUrl: 'https://maps.app.goo.gl/dummy'
    }
];

export default function Locations() {
    return (
        <section className="locations-section" id="location">
            <div className="container">
                <motion.div
                    className="locations-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                >
                    <h2>Temukan Kami</h2>
                    <p>Kunjungi cabang Zensei terdekat di kota Anda.</p>
                </motion.div>

                <div className="locations-grid">
                    {/* Left: Map Embed */}
                    <motion.div
                        className="map-container"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9168156102123!2d107.6186846147728!3d-6.913076895003666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Zensei Locations Map"
                        ></iframe>
                    </motion.div>

                    {/* Right: Branch List */}
                    <div className="branch-list-container">
                        {branches.map((branch, index) => (
                            <motion.div
                                key={branch.id}
                                className="branch-card"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                            >
                                <div className="branch-icon">
                                    <MapPin size={24} color="var(--color-primary)" />
                                </div>
                                <div className="branch-info">
                                    <h4>{branch.name}</h4>
                                    <p>{branch.address}</p>
                                    <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="branch-link">
                                        Lihat Titik Maps
                                        <ArrowRight size={16} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
