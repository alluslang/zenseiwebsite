import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './CMS.css'; // Shared CSS for all CMS pages (will create next)

export default function HeroCMS() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHeroContent();
    }, []);

    const fetchHeroContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('hero_content')
            .select('*')
            .eq('is_active', true)
            .single();

        if (data && !error) {
            setContent(data);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        // We update the active row
        const { error } = await supabase
            .from('hero_content')
            .update({
                heading_id: content.heading_id,
                heading_en: content.heading_en,
                description_id: content.description_id,
                description_en: content.description_en,
                primary_cta_id: content.primary_cta_id,
                primary_cta_en: content.primary_cta_en,
                image_url: content.image_url
            })
            .eq('id', content.id);

        setSaving(false);
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Hero content saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div>Loading Hero data...</div>;
    if (!content) return <div>No active hero content found in database.</div>;

    return (
        <div className="cms-page">
            <h3>Edit Hero Section</h3>

            {message && <div className={`cms-message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            <form onSubmit={handleSave} className="cms-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Heading (ID)</label>
                        <input type="text" name="heading_id" value={content.heading_id || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Heading (EN)</label>
                        <input type="text" name="heading_en" value={content.heading_en || ''} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Description (ID)</label>
                        <textarea name="description_id" value={content.description_id || ''} onChange={handleChange} rows="3" required />
                    </div>
                    <div className="form-group">
                        <label>Description (EN)</label>
                        <textarea name="description_en" value={content.description_en || ''} onChange={handleChange} rows="3" required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Button Text (ID)</label>
                        <input type="text" name="primary_cta_id" value={content.primary_cta_id || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Button Text (EN)</label>
                        <input type="text" name="primary_cta_en" value={content.primary_cta_en || ''} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Hero Image URL</label>
                    <input type="url" name="image_url" value={content.image_url || ''} onChange={handleChange} />
                    {content.image_url && (
                        <img src={content.image_url} alt="Hero Preview" className="cms-image-preview" />
                    )}
                </div>

                <button type="submit" disabled={saving} className="cms-btn-primary">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
