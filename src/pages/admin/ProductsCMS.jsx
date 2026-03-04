import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import './CMS.css';

export default function ProductsCMS() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Modal / Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('sort_order', { ascending: true });

        if (data && !error) {
            setProducts(data);
        }
        setLoading(false);
    };

    const handleAddNew = () => {
        setCurrentProduct({
            title_id: '', title_en: '',
            description_id: '', description_en: '',
            image_url: '',
            sort_order: products.length + 1,
            color: '#C50406',
            rating: 5.0
        });
        setIsEditing(true);
    };

    const handleEdit = (product) => {
        setCurrentProduct({ ...product });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setLoading(true);
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            setMessage(`Error deleting: ${error.message}`);
        } else {
            setMessage('Product deleted successfully');
            fetchProducts();
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        let error;
        if (currentProduct.id) {
            // Update
            const { error: updateError } = await supabase
                .from('products')
                .update(currentProduct)
                .eq('id', currentProduct.id);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from('products')
                .insert([currentProduct]);
            error = insertError;
        }

        setSaving(false);
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Product saved successfully!');
            setIsEditing(false);
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading && !isEditing) return <div>Loading products...</div>;

    return (
        <div className="cms-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f2f5', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <h3 style={{ borderBottom: 'none', margin: 0, padding: 0 }}>Manage Products</h3>
                {!isEditing && (
                    <button onClick={handleAddNew} className="cms-btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
                        <Plus size={18} /> Add New
                    </button>
                )}
            </div>

            {message && <div className={`cms-message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            {isEditing ? (
                <form onSubmit={handleSave} className="cms-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title (ID)</label>
                            <input type="text" name="title_id" value={currentProduct.title_id || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Title (EN)</label>
                            <input type="text" name="title_en" value={currentProduct.title_en || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Description (ID)</label>
                            <textarea name="description_id" value={currentProduct.description_id || ''} onChange={handleChange} rows="3" required />
                        </div>
                        <div className="form-group">
                            <label>Description (EN)</label>
                            <textarea name="description_en" value={currentProduct.description_en || ''} onChange={handleChange} rows="3" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Color (Hex)</label>
                            <input type="color" name="color" value={currentProduct.color || '#C50406'} onChange={handleChange} style={{ height: '40px', padding: '0 5px' }} />
                        </div>
                        <div className="form-group">
                            <label>Rating (1.0 - 5.0)</label>
                            <input type="number" step="0.1" name="rating" value={currentProduct.rating || 5.0} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Sort Order</label>
                            <input type="number" name="sort_order" value={currentProduct.sort_order || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="url" name="image_url" value={currentProduct.image_url || ''} onChange={handleChange} required />
                        </div>
                    </div>

                    {currentProduct.image_url && (
                        <div className="form-group">
                            <img src={currentProduct.image_url} alt="Preview" className="cms-image-preview" style={{ maxHeight: '150px' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" disabled={saving} className="cms-btn-primary">
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="cms-btn-primary" style={{ background: '#f5f5f5', color: '#333' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', padding: '1rem' }}>
                            <div style={{ height: '150px', backgroundColor: product.color || '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', borderRadius: '6px', overflow: 'hidden' }}>
                                <img src={product.image_url} alt={product.title_id} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>{product.title_id}</h4>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#666' }}>
                                Order: {product.sort_order} | Rating: {product.rating}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleEdit(product)} style={{ flex: 1, padding: '0.5rem', background: '#f0f2f5', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(product.id)} style={{ padding: '0.5rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
