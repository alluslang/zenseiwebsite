import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [logos, setLogos] = useState({
        navbar_desktop: '/zlogo_white.svg', // defaults
        navbar_mobile: '/zshort_white.svg',
        footer: '/zlogo_dark.svg'
    });

    const [themes, setThemes] = useState({
        hero: {},
        products: {},
        promo: {},
        about: {},
        instagram: {},
        footer: {}
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase.from('site_settings').select('*');

                if (data && !error) {
                    const parsedLogos = data.find(item => item.setting_key === 'logos');
                    if (parsedLogos && parsedLogos.setting_value) {
                        setLogos(prev => ({
                            navbar_desktop: parsedLogos.setting_value.navbar_desktop || prev.navbar_desktop,
                            navbar_mobile: parsedLogos.setting_value.navbar_mobile || prev.navbar_mobile,
                            footer: parsedLogos.setting_value.footer || prev.footer
                        }));
                    }

                    const parsedThemes = { ...themes };
                    data.forEach(item => {
                        if (item.setting_key.startsWith('theme_')) {
                            const section = item.setting_key.replace('theme_', '');
                            parsedThemes[section] = item.setting_value;
                        }
                    });
                    setThemes(parsedThemes);
                }
            } catch (err) {
                console.error("Error fetching theme settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Helper to generate CSS background string
    const getBackgroundStyle = (themeData) => {
        if (!themeData || Object.keys(themeData).length === 0) return {};

        switch (themeData.type) {
            case 'solid':
                return { backgroundColor: themeData.color || 'transparent' };
            case 'linear_gradient':
                return { background: `linear-gradient(${themeData.angle || '180deg'}, ${themeData.color1 || 'transparent'}, ${themeData.color2 || 'transparent'})` };
            case 'radial_gradient':
                return { background: `radial-gradient(circle, ${themeData.color1 || 'transparent'}, ${themeData.color2 || 'transparent'})` };
            case 'image':
                return {
                    backgroundImage: `url(${themeData.image_url})`,
                    backgroundSize: themeData.size || 'cover',
                    backgroundRepeat: themeData.repeat || 'no-repeat',
                    backgroundPosition: 'center'
                };
            default:
                return {};
        }
    };

    const value = {
        logos,
        themes,
        loading,
        getBackgroundStyle
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
