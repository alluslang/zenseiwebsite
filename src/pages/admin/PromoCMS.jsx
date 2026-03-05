import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './CMS.css';

export default function PromoCMS() {
    const [promoContent, setPromoContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPromoContent();
    }, []);

    const fetchPromoContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('promo_content')
            .select('*')
            .limit(1)
            .single();

        if (data && !error) {
            setPromoContent(data);
        } else {
            // Default structure if table is empty
            setPromoContent({
                id: null,
                text_id: '',
                text_en: '',
                link_url: '',
                is_active: false
            });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPromoContent(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const toastId = toast.loading('Saving promo...');

        let error;
        if (promoContent.id) {
            const { error: updateError } = await supabase
                .from('promo_content')
                .update({
                    text_id: promoContent.text_id,
                    text_en: promoContent.text_en,
                    link_url: promoContent.link_url,
                    is_active: promoContent.is_active
                })
                .eq('id', promoContent.id);
            error = updateError;
        } else {
            // Very first save
            const { error: insertError } = await supabase
                .from('promo_content')
                .insert([{
                    text_id: promoContent.text_id,
                    text_en: promoContent.text_en,
                    link_url: promoContent.link_url,
                    is_active: promoContent.is_active
                }]);
            error = insertError;

            // Re-fetch to get the new ID
            if (!insertError) {
                fetchPromoContent();
            }
        }

        setSaving(false);
        if (error) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        } else {
            toast.success('Promo text saved successfully!', { id: toastId });
        }
    };

    if (loading) return <div>Loading Promo data...</div>;

    return (
        <div className="cms-page">
            <h3>Promo / Running Text</h3>

            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                    <strong>Note:</strong> Ini adalah teks berjalan yang muncul di paling atas website sebelum navbar.
                </p>
            </div>

            <form onSubmit={handleSave} className="cms-form">
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e3f2fd', padding: '1rem', borderRadius: '8px' }}>
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={promoContent?.is_active || false}
                        onChange={handleChange}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer', fontWeight: 'bold', color: '#0277bd' }}>
                        Tampilkan Banner Promo di Website (Aktif)
                    </label>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Teks Promo (Bahasa Indonesia) 🔥</label>
                    <textarea
                        name="text_id"
                        value={promoContent?.text_id || ''}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Contoh: 🔥 PROMO SPESIAL: Diskon 20% hari ini! 🔥"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Promo Text (English) 🔥</label>
                    <textarea
                        name="text_en"
                        value={promoContent?.text_en || ''}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Example: 🔥 SPECIAL DEAL: 20% Off today! 🔥"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tautan Promo (Tujuan Link) - Opsional 🔗</label>
                    <input
                        type="url"
                        name="link_url"
                        value={promoContent?.link_url || ''}
                        onChange={handleChange}
                        placeholder="Contoh: https://wa.me/62... atau biarkan kosong"
                    />
                </div>

                <button type="submit" disabled={saving} className="cms-btn-primary">
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
}
