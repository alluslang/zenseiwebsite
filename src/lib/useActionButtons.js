import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Default fallback URLs in case CMS is unavailable
const defaultButtons = {
    join_partnership: 'https://wa.me/6281234567890',
    online_order: 'https://wa.me/6281234567890',
    ready_to_eat: 'https://wa.me/6281234567890',
    ready_to_cook: 'https://wa.me/6281234567890',
    hero_primary: 'https://wa.me/6281234567890',
};

/**
 * A custom hook that fetches all action button URLs from Supabase CMS.
 * Returns a map of { button_key: url } and a loading state.
 */
export function useActionButtons() {
    const [buttons, setButtons] = useState(defaultButtons);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchButtons = async () => {
            try {
                const { data, error } = await supabase
                    .from('action_buttons')
                    .select('button_key, url');

                if (data && !error) {
                    const mapped = { ...defaultButtons };
                    data.forEach(({ button_key, url }) => {
                        mapped[button_key] = url;
                    });
                    setButtons(mapped);
                }
            } catch (err) {
                console.warn('Could not fetch action buttons, using defaults.', err);
            } finally {
                setLoading(false);
            }
        };

        fetchButtons();
    }, []);

    return { buttons, loading };
}
