import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './CMS.css';

export default function DashboardCMS() {
    const [embedUrl, setEmbedUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('setting_value')
            .eq('setting_key', 'analytics_embed_url')
            .maybeSingle();

        if (data && !error) {
            setEmbedUrl(data.setting_value?.url || '');
        } else if (error && error.code !== 'PGRST116') {
            // Log error except "Row not found" (PGRST116)
            console.error('Error fetching analytics settings:', error);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const toastId = toast.loading('Saving analytics configuration...');

        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert(
                    { setting_key: 'analytics_embed_url', setting_value: { url: embedUrl }, updated_at: new Date() },
                    { onConflict: 'setting_key' }
                );

            if (error) throw error;
            toast.success('Analytics URL saved successfully!', { id: toastId });
        } catch (error) {
            console.error('Save error:', error);
            toast.error(`Error saving: ${error.message || 'Unknown error'}`, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Memuat Dasbor Analitik...</div>;

    // Helper to extract the src URL if user pastes the entire iframe code
    const handleUrlChange = (e) => {
        let input = e.target.value;
        const srcMatch = input.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
            input = srcMatch[1];
        }
        setEmbedUrl(input);
    };

    return (
        <div className="cms-page">
            <h3>Overview & Analytics</h3>

            <form onSubmit={handleSave} className="cms-form" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <div className="form-group">
                    <label style={{ color: '#495057', fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Google Looker Studio Embed URL
                    </label>
                    <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Masukkan Tautan Sematan <strong>(Embed URL)</strong> atau tempelkan seluruh kode <strong>&lt;iframe&gt;</strong> dari Google Looker Studio Anda di sini untuk memunculkan grafik pelacakan data pengunjung <i>live</i> dari GA4.
                    </p>
                    <input
                        type="text"
                        value={embedUrl}
                        onChange={handleUrlChange}
                        placeholder="Contoh: https://lookerstudio.google.com/embed/reporting/..."
                        style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <button type="submit" disabled={saving} className="cms-btn-primary">
                        {saving ? 'Menyimpan...' : 'Simpan Tautan Analitik'}
                    </button>
                    <a 
                        href="https://lookerstudio.google.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ marginLeft: '1rem', color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.9rem' }}
                    >
                        Buka Looker Studio &rarr;
                    </a>
                </div>
            </form>

            {embedUrl ? (
                <div style={{ width: '100%', height: '800px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        title="Zensei Website Analytics Dashboard"
                    ></iframe>
                </div>
            ) : (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fafafa', border: '2px dashed #ddd', borderRadius: '8px', color: '#888' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <h4>Dasbor Analitik Belum Dikonfigurasi</h4>
                    <p style={{ maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                        Grafik laporan trafik akan muncul di sini. Silakan rancang dasbor Anda di <strong>Google Looker Studio</strong> (dengan menghubungkan properti GA4 Anda), dapatkan tautan sematannya (Embed Link), lalu tempelkan di kotak isian di atas.
                    </p>
                </div>
            )}
        </div>
    );
}
