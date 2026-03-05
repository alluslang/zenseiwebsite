import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/admin/ImageUploader';
import './CMS.css';

export default function PromoSectionCMS() {
    const [promo, setPromo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPromo();
    }, []);

    const fetchPromo = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('promo_sections')
            .select('*')
            .limit(1)
            .single();

        if (data && !error) {
            setPromo(data);
        } else {
            // Default structure if table is empty
            setPromo({
                id: null,
                image_url: '',
                title_id: '',
                title_en: '',
                description_id: '',
                description_en: '',
                button_text_id: '',
                button_text_en: '',
                button_url: '',
                is_active: false
            });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPromo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (url) => {
        setPromo(prev => ({
            ...prev,
            image_url: url
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const toastId = toast.loading('Saving Promo Section...');

        let error;
        const payload = {
            image_url: promo.image_url,
            title_id: promo.title_id,
            title_en: promo.title_en,
            description_id: promo.description_id,
            description_en: promo.description_en,
            button_text_id: promo.button_text_id,
            button_text_en: promo.button_text_en,
            button_url: promo.button_url,
            is_active: promo.is_active
        };

        if (promo.id) {
            const { error: updateError } = await supabase
                .from('promo_sections')
                .update(payload)
                .eq('id', promo.id);
            error = updateError;
        } else {
            // Very first save
            const { error: insertError } = await supabase
                .from('promo_sections')
                .insert([payload]);
            error = insertError;

            // Re-fetch to get the new ID
            if (!insertError) {
                fetchPromo();
            }
        }

        setSaving(false);
        if (error) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        } else {
            toast.success('Promo Section saved successfully!', { id: toastId });
        }
    };

    if (loading) return <div>Loading Promo Section data...</div>;

    return (
        <div className="cms-page">
            <h3>Dynamic Promo Section</h3>

            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                    <strong>Note:</strong> Ini adalah area promosi besar yang muncul di bawah *Products* pada halaman utama. Anda dapat menyalakan/mematikan (*toggle*) area ini jika sedang ada _event_ atau diskon khusus.
                </p>
            </div>

            <form onSubmit={handleSave} className="cms-form">
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e3f2fd', padding: '1rem', borderRadius: '8px' }}>
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={promo?.is_active || false}
                        onChange={handleChange}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer', fontWeight: 'bold', color: '#0277bd' }}>
                        Tampilkan Dynamic Promo Section di Website (Aktif)
                    </label>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Gambar Promo</label>
                    <ImageUploader
                        value={promo?.image_url}
                        onChange={handleImageUpload}
                        aspect={1 / 1} // Can be 1:1 or free
                        guideText="Rekomendasi: Potret persegi (1:1) atau vertikal mendatar."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Judul Promo (ID)</label>
                        <input type="text" name="title_id" value={promo?.title_id || ''} onChange={handleChange} placeholder="Spesial Gajian!" required />
                    </div>
                    <div className="form-group">
                        <label>Promo Title (EN)</label>
                        <input type="text" name="title_en" value={promo?.title_en || ''} onChange={handleChange} placeholder="Payday Special!" required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Deskripsi (ID)</label>
                        <textarea name="description_id" value={promo?.description_id || ''} onChange={handleChange} rows="4" placeholder="Dapatkan diskon 20% untuk semua produk..." required />
                    </div>
                    <div className="form-group">
                        <label>Description (EN)</label>
                        <textarea name="description_en" value={promo?.description_en || ''} onChange={handleChange} rows="4" placeholder="Get 20% off for all products..." required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Teks Tombol (ID)</label>
                        <input type="text" name="button_text_id" value={promo?.button_text_id || ''} onChange={handleChange} placeholder="Pesan Sekarang" required />
                    </div>
                    <div className="form-group">
                        <label>Button Text (EN)</label>
                        <input type="text" name="button_text_en" value={promo?.button_text_en || ''} onChange={handleChange} placeholder="Order Now" required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Tautan Tombol (URL Kunjungan) 🔗</label>
                    <input type="url" name="button_url" value={promo?.button_url || ''} onChange={handleChange} placeholder="https://wa.me/62... atau https://tokopedia.com/..." required />
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" disabled={saving} className="cms-btn-primary">
                        {saving ? 'Saving...' : 'Save Promo Section'}
                    </button>
                </div>
            </form>
        </div>
    );
}
