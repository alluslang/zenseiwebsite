import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import './CMS.css';

export default function AboutUsCMS() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('about_slides')
            .select('*')
            .order('order_num', { ascending: true });

        if (data && !error) {
            setSlides(data);
        }
        setLoading(false);
    };

    const handleAddNew = () => {
        setCurrentSlide({
            nav_title_id: '', nav_title_en: '',
            heading_id: '', heading_en: '',
            paragraph_id: '', paragraph_en: '',
            image_url: '',
            order_num: slides.length + 1
        });
        setIsEditing(true);
    };

    const handleEdit = (slide) => {
        setCurrentSlide({ ...slide });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return;

        setLoading(true);
        const { error } = await supabase.from('about_slides').delete().eq('id', id);

        if (error) {
            setMessage(`Error deleting: ${error.message} `);
        } else {
            setMessage('Slide deleted successfully');
            fetchSlides();
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setCurrentSlide(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        let error;
        if (currentSlide.id) {
            const { error: updateError } = await supabase
                .from('about_slides')
                .update(currentSlide)
                .eq('id', currentSlide.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('about_slides')
                .insert([currentSlide]);
            error = insertError;
        }

        setSaving(false);
        if (error) {
            setMessage(`Error: ${error.message} `);
        } else {
            setMessage('Slide saved successfully!');
            setIsEditing(false);
            fetchSlides();
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading && !isEditing) return <div>Loading About Us slides...</div>;

    return (
        <div className="cms-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f2f5', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <h3 style={{ borderBottom: 'none', margin: 0, padding: 0 }}>Manage About Us Slides</h3>
                {!isEditing && (
                    <button onClick={handleAddNew} className="cms-btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
                        <Plus size={18} /> Add Slide
                    </button>
                )}
            </div>

            {message && <div className={`cms - message ${message.includes('Error') ? 'error' : 'success'} `}>{message}</div>}

            {isEditing ? (
                <form onSubmit={handleSave} className="cms-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nav Title (ID)</label>
                            <input type="text" name="nav_title_id" value={currentSlide.nav_title_id || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Nav Title (EN)</label>
                            <input type="text" name="nav_title_en" value={currentSlide.nav_title_en || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Heading (ID)</label>
                            <input type="text" name="heading_id" value={currentSlide.heading_id || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Heading (EN)</label>
                            <input type="text" name="heading_en" value={currentSlide.heading_en || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Paragraph (ID)</label>
                            <textarea name="paragraph_id" value={currentSlide.paragraph_id || ''} onChange={handleChange} rows="4" required />
                        </div>
                        <div className="form-group">
                            <label>Paragraph (EN)</label>
                            <textarea name="paragraph_en" value={currentSlide.paragraph_en || ''} onChange={handleChange} rows="4" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="url" name="image_url" value={currentSlide.image_url || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Order Number</label>
                            <input type="number" name="order_num" value={currentSlide.order_num || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    {currentSlide.image_url && (
                        <div className="form-group">
                            <img src={currentSlide.image_url} alt="Preview" className="cms-image-preview" style={{ maxHeight: '150px' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" disabled={saving} className="cms-btn-primary">
                            {saving ? 'Saving...' : 'Save Slide'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="cms-btn-primary" style={{ background: '#f5f5f5', color: '#333' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {slides.map(slide => (
                        <div key={slide.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '150px', height: '100px', backgroundColor: '#f9f9f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <img src={slide.image_url} alt={slide.heading_id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{slide.nav_title_id} / {slide.nav_title_en}</h4>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#555' }}>
                                    {slide.heading_id}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                                    Order: {slide.order_num}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '100px' }}>
                                <button onClick={() => handleEdit(slide)} style={{ padding: '0.5rem', background: '#f0f2f5', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(slide.id)} style={{ padding: '0.5rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
