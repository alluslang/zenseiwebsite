import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dictionaries
const resources = {
    en: {
        translation: {
            "navbar": {
                "product": "Product",
                "about_us": "About us",
                "social_media": "Social Media",
                "location": "Location",
                "join_partnership": "Join Partnership",
                "join_partnership": "Join Partnership",
                "online_order": "Online Order"
            },
            "products": {
                "header_title": "Zensei is more than one dish.",
                "header_desc": "It's a full lineup of smoky proteins, vibrant sambals, and signature rice combinations. ready for quick bites, sharing sessions, or stocking your freezer.",
                "ready_to_eat": "Ready to Eat?",
                "ready_to_cook": "Ready to Cook?",
                "items": {
                    "1": { "title": "Smoked chicken (Sei Ayam)", "desc": "served with a variety of rice and sambal options." },
                    "2": { "title": "Smoked beef (Sei Sapi)", "desc": "served with a variety of rice and sambal options." },
                    "3": { "title": "Authentic Indonesian sambal selections", "desc": "including sambal matah, Krakatau, lado mudo, and kecombrang." },
                    "4": { "title": "A selection of white rice and traditional", "desc": "Indonesian specialties including nasi jeruk and nasi cikur." },
                    "5": { "title": "Ready-to-cook products", "desc": "are also available in vacuum-packed packaging." }
                }
            },
            "about": {
                "heading": "Tradition Elevated.",
                "desc": "We honor sei as a culinary heritage, elevating it through higher quality standards, strict hygiene, and a process tailored for modern needs."
            }
        }
    },
    id: {
        translation: {
            "navbar": {
                "product": "Produk",
                "about_us": "Tentang Kami",
                "social_media": "Sosial Media",
                "location": "Lokasi",
                "join_partnership": "Gabung Kemitraan",
                "join_partnership": "Gabung Kemitraan",
                "online_order": "Pesan Online"
            },
            "products": {
                "header_title": "Zensei lebih dari sekadar satu hidangan.",
                "header_desc": "Beragam pilihan protein asap, sambal spesial, dan kombinasi nasi khas. Siap disajikan dengan cepat, untuk dinikmati bersama, atau disimpan stok kulkas.",
                "ready_to_eat": "Siap Makan?",
                "ready_to_cook": "Siap Masak?",
                "items": {
                    "1": { "title": "Ayam Asap (Sei Ayam)", "desc": "disajikan dengan beragam pilihan nasi dan sambal." },
                    "2": { "title": "Daging Sapi Asap (Sei Sapi)", "desc": "disajikan dengan beragam pilihan nasi dan sambal." },
                    "3": { "title": "Pilihan sambal autentik", "desc": "termasuk sambal matah, Krakatau, lado mudo, dan kecombrang." },
                    "4": { "title": "Pilihan nasi tradisional", "desc": "spesial ala Indonesia termasuk nasi jeruk dan nasi cikur." },
                    "5": { "title": "Produk siap saji", "desc": "juga tersedia dalam kemasan vakum praktis." }
                }
            },
            "about": {
                "heading": "Tradisi yang Ditingkatkan.",
                "desc": "Kami menghormati sei sebagai warisan kuliner, meningkatkannya melalui standar kualitas yang lebih tinggi, kebersihan yang ketat, dan proses yang disesuaikan untuk kebutuhan modern."
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en', // Default to English 
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

export default i18n;
