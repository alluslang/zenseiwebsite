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
            heading_id: '', heading_en: '',
            description_id: '', description_en: '',
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
        if (!window.confirm('Delete this slide?')) return;

        setLoading(true);
        const { error } = await supabase.from('about_slides').delete().eq('id', id);

        if (error) {
            setMessage(`Error: ${error.message}`);
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
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Slide saved successfully!');
            setIsEditing(false);
            fetchSlides();
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading && !isEditing) return <div>Loading about slides...</div>;

    return (
        <div className="cms-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f0f2f5', paddingBottom: '0.8rem' }}>
                <h3 style={{ margin: 0, padding: 0, border: 'none' }}>About Us Slides</h3>
                {!isEditing && (
                    <button onClick={handleAddNew} className="cms-btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
                        <Plus size={18} /> Add Slide
                    </button>
                )}
            </div>

            {message && <div className={`cms-message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            {isEditing ? (
                <form onSubmit={handleSave} className="cms-form">
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
                            <label>Description (ID)</label>
                            <textarea name="description_id" value={currentSlide.description_id || ''} onChange={handleChange} rows="4" required />
                        </div>
                        <div className="form-group">
                            <label>Description (EN)</label>
                            <textarea name="description_en" value={currentSlide.description_en || ''} onChange={handleChange} rows="4" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="url" name="image_url" value={currentSlide.image_url || ''} onChange={handleChange} required />
                            {currentSlide.image_url && (
                                <img src={currentSlide.image_url} alt="Preview" className="cms-image-preview" style={{ maxHeight: '150px' }} />
                            )}
                        </div>
                        <div className="form-group">
                            <label>Order Number</label>
                            <input type="number" name="order_num" value={currentSlide.order_num || ''} onChange={handleChange} required />
                        </div>
                    </div>

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
                        <div key={slide.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                            <div style={{ width: '150px', flexShrink: 0 }}>
                                <img src={slide.image_url} alt={slide.heading_id} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{slide.order_num}. {slide.heading_id}</h4>
                                <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>{slide.description_id?.substring(0, 100)}...</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(slide)} style={{ padding: '0.4rem 0.8rem', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '0.3rem', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(slide.id)} style={{ padding: '0.4rem 0.8rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '0.3rem', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
