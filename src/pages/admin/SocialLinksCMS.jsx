import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import './CMS.css';

export default function SocialLinksCMS() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [currentLink, setCurrentLink] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('social_links')
            .select('*')
            .order('order_num', { ascending: true });

        if (data && !error) {
            setLinks(data);
        }
        setLoading(false);
    };

    const handleAddNew = () => {
        setCurrentLink({
            platform_name: '', icon_name: 'Instagram',
            url: '', username: '', color: '#000000',
            order_num: links.length + 1
        });
        setIsEditing(true);
    };

    const handleEdit = (link) => {
        setCurrentLink({ ...link });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this social link?')) return;

        setLoading(true);
        const { error } = await supabase.from('social_links').delete().eq('id', id);

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Social link deleted successfully');
            fetchLinks();
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setCurrentLink(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        let error;
        if (currentLink.id) {
            const { error: updateError } = await supabase
                .from('social_links')
                .update(currentLink)
                .eq('id', currentLink.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('social_links')
                .insert([currentLink]);
            error = insertError;
        }

        setSaving(false);
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Link saved successfully!');
            setIsEditing(false);
            fetchLinks();
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading && !isEditing) return <div>Loading social links...</div>;

    return (
        <div className="cms-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f0f2f5', paddingBottom: '0.8rem' }}>
                <h3 style={{ margin: 0, padding: 0, border: 'none' }}>Social Media Links</h3>
                {!isEditing && (
                    <button onClick={handleAddNew} className="cms-btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
                        <Plus size={18} /> Add Link
                    </button>
                )}
            </div>

            {message && <div className={`cms-message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            {isEditing ? (
                <form onSubmit={handleSave} className="cms-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Platform Name (e.g., Instagram)</label>
                            <input type="text" name="platform_name" value={currentLink.platform_name || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Icon Name (lucide-react name or 'TikTok')</label>
                            <input type="text" name="icon_name" value={currentLink.icon_name || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Destination URL</label>
                        <input type="url" name="url" value={currentLink.url || ''} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Hover Color (Hex) e.g., #E1306C</label>
                            <input type="color" name="color" value={currentLink.color || '#000000'} onChange={handleChange} style={{ height: '40px', padding: '0 5px' }} />
                        </div>
                        <div className="form-group">
                            <label>Order Number</label>
                            <input type="number" name="order_num" value={currentLink.order_num || ''} onChange={handleChange} required />
                        </div>
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
                    {links.map(link => (
                        <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {link.icon_name.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.2rem 0' }}>{link.platform_name}</h4>
                                    <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#666', fontSize: '0.85rem' }}>{link.url.substring(0, 40)}...</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ padding: '0.4rem 0.8rem', background: '#f5f5f5', borderRadius: '4px', fontSize: '0.85rem', color: '#666', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                                    Order: {link.order_num}
                                </span>
                                <button onClick={() => handleEdit(link)} style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}>
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(link.id)} style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#c62828' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
