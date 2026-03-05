import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/admin/ImageUploader';
import './CMS.css';

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
            .limit(1)
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

        const toastId = toast.loading('Saving changes...');

        // We update the active row
        const { error } = await supabase
            .from('hero_content')
            .update({
                badge_text_id: content.badge_text_id,
                badge_text_en: content.badge_text_en,
                heading_id: content.heading_id,
                heading_en: content.heading_en,
                subheading_id: content.subheading_id,
                subheading_en: content.subheading_en,
                primary_button_text_id: content.primary_button_text_id,
                primary_button_text_en: content.primary_button_text_en,
                image_url: content.image_url
            })
            .eq('id', content.id);

        setSaving(false);
        if (error) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        } else {
            toast.success('Hero content saved successfully!', { id: toastId });
        }
    };

    if (loading) return <div>Loading Hero data...</div>;
    if (!content) return <div>No hero content found.</div>;

    return (
        <div className="cms-page">
            <h3>Edit Hero Section</h3>

            <form onSubmit={handleSave} className="cms-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Badge Text (ID)</label>
                        <input type="text" name="badge_text_id" value={content.badge_text_id || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Badge Text (EN)</label>
                        <input type="text" name="badge_text_en" value={content.badge_text_en || ''} onChange={handleChange} required />
                    </div>
                </div>

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
                        <label>Subheading (ID)</label>
                        <textarea name="subheading_id" value={content.subheading_id || ''} onChange={handleChange} rows="3" required />
                    </div>
                    <div className="form-group">
                        <label>Subheading (EN)</label>
                        <textarea name="subheading_en" value={content.subheading_en || ''} onChange={handleChange} rows="3" required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Button Text (ID)</label>
                        <input type="text" name="primary_button_text_id" value={content.primary_button_text_id || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Button Text (EN)</label>
                        <input type="text" name="primary_button_text_en" value={content.primary_button_text_en || ''} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Hero Image</label>
                    <ImageUploader
                        value={content.image_url}
                        onChange={handleChange}
                        guideText="Recommended size: 800x800px or larger. You can crop it freely."
                    />
                </div>

                <button type="submit" disabled={saving} className="cms-btn-primary">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
