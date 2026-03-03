import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useActionButtons } from '../lib/useActionButtons';
import './Products.css';

const products = [
    {
        id: 1,
        color: '#8cb151',
        rating: 5,
        title: 'Smoked chicken (Sei Ayam)',
        description: 'served with a variety of rice and sambal options.',
        image: 'https://uqbmjppllifwjrofpbeb.supabase.co/storage/v1/object/public/Zensei/zenseihero.png'
    },
    {
        id: 2,
        color: '#cd1818',
        rating: 5,
        title: 'Smoked beef (Sei Sapi)',
        description: 'served with a variety of rice and sambal options.',
        image: 'https://uqbmjppllifwjrofpbeb.supabase.co/storage/v1/object/public/Zensei/zenseihero.png'
    },
    {
        id: 3,
        color: '#187bcd',
        rating: 5,
        title: 'Authentic Indonesian sambal selections',
        description: 'including sambal matah, Krakatau, lado mudo, and kecombrang.',
        image: 'https://uqbmjppllifwjrofpbeb.supabase.co/storage/v1/object/public/Zensei/zenseihero.png'
    },
    {
        id: 4,
        color: '#f09819',
        rating: 5,
        title: 'A selection of white rice and traditional',
        description: 'Indonesian specialties including nasi jeruk and nasi cikur.',
        image: 'https://uqbmjppllifwjrofpbeb.supabase.co/storage/v1/object/public/Zensei/zenseihero.png'
    },
    {
        id: 5,
        color: '#000000',
        rating: 5,
        title: 'Ready-to-cook products',
        description: 'are also available in vacuum-packed packaging.',
        image: 'https://uqbmjppllifwjrofpbeb.supabase.co/storage/v1/object/public/Zensei/zenseihero.png'
    }
];

export default function Products() {
    const { t, i18n } = useTranslation();
    const { buttons } = useActionButtons();
    const scrollContainerRef = useRef(null);
    const [headerData, setHeaderData] = useState(null);
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const [headerRes, productsRes] = await Promise.all([
                    supabase.from('products_section_content').select('*').single(),
                    supabase.from('products').select('*').order('sort_order', { ascending: true })
                ]);

                if (headerRes.data) setHeaderData(headerRes.data);
                if (productsRes.data) setProductsData(productsRes.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const getLocalizedHeader = (field) => {
        if (!headerData) return t(`products.${field}`);
        const langCode = i18n.language.startsWith('id') ? 'id' : 'en';
        return headerData[`${field}_${langCode}`] || t(`products.${field}`);
    };

    const getProductField = (product, field) => {
        const langCode = i18n.language.startsWith('id') ? 'id' : 'en';
        if (product[`${field}_${langCode}`]) return product[`${field}_${langCode}`];
        // fallback translation mapping
        const i18nKey = field === 'description' ? 'desc' : field;
        return t(`products.items.${product.id || 1}.${i18nKey}`);
    };

    const displayProducts = productsData.length > 0 ? productsData : products;

    useEffect(() => {
        const updateDots = () => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const track = container.querySelector('.carousel-track');
                if (track) {
                    const scrollableWidth = track.scrollWidth - container.clientWidth;
                    const { width, gap } = getCardMetrics(container);
                    // Determine how many dots are needed based on max scroll width
                    const totalDots = Math.max(1, Math.ceil(scrollableWidth / (width + gap)) + 1);
                    setDotCount(totalDots);
                }
            }
        };

        // Delay to allow render
        setTimeout(updateDots, 100);
        window.addEventListener('resize', updateDots);
        return () => window.removeEventListener('resize', updateDots);
    }, [displayProducts]);

    const getCardMetrics = (container) => {
        const card = container.querySelector('.product-card');
        if (!card) return { width: 380, gap: 24 };
        const gap = window.innerWidth <= 768 ? 16 : 24;
        return { width: card.offsetWidth, gap };
    };

    const handleScroll = (e) => {
        const container = e.target;
        const { width, gap } = getCardMetrics(container);
        const index = Math.round(container.scrollLeft / (width + gap));
        setActiveIndex(Math.min(index, displayProducts.length - 1));
    };

    const scrollToDot = (index) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const { width, gap } = getCardMetrics(container);
            container.scrollTo({
                left: index * (width + gap),
                behavior: 'smooth'
            });
            setActiveIndex(index);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const { width, gap } = getCardMetrics(container);
            const scrollAmount = width + gap;

            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="products-section" id="product">
            <div className="container">
                <motion.div
                    className="products-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2>{getLocalizedHeader('header_title')}</h2>
                    <p>{getLocalizedHeader('header_desc')}</p>
                </motion.div>
            </div>

            <motion.div
                className="carousel-wrapper"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
                <button className="carousel-nav-btn prev" onClick={() => scroll('left')}>
                    <ChevronLeft size={24} color="var(--color-black)" />
                </button>

                <div className="carousel-container" ref={scrollContainerRef} onScroll={handleScroll}>
                    <div className="carousel-track">
                        {displayProducts.map((product, index) => {
                            const isLastCard = index === displayProducts.length - 1;
                            return (
                                <div
                                    key={product.id}
                                    className={`product-card ${isLastCard ? 'last-card' : ''}`}
                                    style={{ backgroundColor: product.color }}
                                >
                                    <div className="product-card-content">
                                        <div className="product-text-content">
                                            <div className="product-stars">
                                                {[...Array(product.rating || 5)].map((_, i) => (
                                                    <Star key={i} size={16} fill="white" color="white" />
                                                ))}
                                            </div>
                                            <h3 className="product-title">{getProductField(product, 'title')}</h3>
                                            <p className="product-desc">{getProductField(product, 'description')}</p>
                                        </div>
                                        <div className="product-image-container">
                                            <img src={product.image_url || product.image} alt={getProductField(product, 'title')} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="carousel-nav-btn next" onClick={() => scroll('right')}>
                    <ChevronRight size={24} color="var(--color-black)" />
                </button>
            </motion.div>

            <motion.div
                className="container"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            >
                <div className="carousel-pagination">
                    {[...Array(dotCount)].map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => scrollToDot(index)}
                            style={{ cursor: 'pointer' }}
                        ></div>
                    ))}
                </div>

                <div className="product-actions">
                    <a href={buttons.ready_to_eat} target="_blank" rel="noopener noreferrer" className="btn btn-red">
                        {t('products.ready_to_eat')}
                        <span className="btn-icon">
                            <ChevronRight size={14} />
                        </span>
                    </a>
                    <a href={buttons.ready_to_cook} target="_blank" rel="noopener noreferrer" className="btn btn-white">
                        {t('products.ready_to_cook')}
                        <span className="btn-icon">
                            <ChevronRight size={14} />
                        </span>
                    </a>
                </div>
            </motion.div>

            {/* Shape Divider Transition to next section */}
            <div className="products-curve-divider">
                <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,200 L0,100 Q720,0 1440,100 L1440,200 Z" fill="#ff9b59" className="shape-fill" />
                </svg>
            </div>
        </section>
    );
}
