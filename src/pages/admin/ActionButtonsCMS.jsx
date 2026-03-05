import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { Edit2 } from 'lucide-react';
import './CMS.css';

export default function ActionButtonsCMS() {
    const [buttons, setButtons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state for editing a single row
    const [isEditing, setIsEditing] = useState(false);
    const [currentButton, setCurrentButton] = useState(null);

    useEffect(() => {
        fetchButtons();
    }, []);

    const fetchButtons = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('action_buttons')
            .select('*')
            .order('label_en', { ascending: true }); // Alphabetical

        if (data && !error) {
            setButtons(data);
        }
        setLoading(false);
    };

    const handleEdit = (btnConfig) => {
        setCurrentButton({ ...btnConfig });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentButton(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const toastId = toast.loading('Saving link...');

        const { error } = await supabase
            .from('action_buttons')
            .update({
                url: currentButton.url,
            })
            .eq('id', currentButton.id);

        setSaving(false);
        if (error) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        } else {
            toast.success('Link saved successfully!', { id: toastId });
            setIsEditing(false);
            fetchButtons();
        }
    };

    if (loading && !isEditing) return <div>Loading Action Buttons data...</div>;

    return (
        <div className="cms-page">
            <h3>Manage Action Buttons (Tautan Tujuan)</h3>

            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                    <strong>Note:</strong> Anda dapat mengubah URL tujuan dari setiap tombol aksi yang ada di website. Pastikan tautan ditulis lengkap dengan <code>https://</code> atau mulai dengan <code>https://wa.me/</code> jika menuju WhatsApp.
                </p>
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="cms-form">
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
                        <strong>Tombol yang sedang diubah:</strong> {currentButton.button_key} <br />
                        <small style={{ color: '#555' }}>Label ID: {currentButton.label_id} | Label EN: {currentButton.label_en}</small>
                    </div>

                    <div className="form-group">
                        <label>Tautan Tujuan (URL)</label>
                        <input
                            type="url"
                            name="url"
                            value={currentButton?.url || ''}
                            onChange={handleChange}
                            placeholder="https://wa.me/62... atau https://gojek.com/..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" disabled={saving} className="cms-btn-primary">
                            {saving ? 'Saving...' : 'Save Link'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="cms-btn-primary" style={{ background: '#f5f5f5', color: '#333' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {buttons.map(btn => (
                        <div key={btn.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#222' }}>{btn.label_id} / {btn.label_en}</h4>
                                <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: '#777', fontFamily: 'monospace' }}>
                                    Key: {btn.button_key}
                                </p>
                                <a href={btn.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: '#0277bd', wordBreak: 'break-all' }}>
                                    {btn.url}
                                </a>
                            </div>
                            <div>
                                <button onClick={() => handleEdit(btn)} style={{ padding: '0.5rem 1rem', background: '#f0f2f5', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                    <Edit2 size={16} /> Edit Tautan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
