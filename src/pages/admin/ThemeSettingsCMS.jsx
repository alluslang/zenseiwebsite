import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/admin/ImageUploader';
import './CMS.css';

export default function ThemeSettingsCMS() {
    const [activeTab, setActiveTab] = useState('logos'); // 'logos' or 'backgrounds'
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [logos, setLogos] = useState({ navbar_desktop: '', navbar_mobile: '', footer: '' });

    // We'll manage sections in a dictionary for easy mapping
    const [themes, setThemes] = useState({
        hero: { type: 'solid', color: '#fcfbf9', show_divider: false },
        products: { type: 'solid', color: '#ffffff', show_divider: false },
        promo: { type: 'solid', color: '#fcfbf9', show_divider: false },
        about: { type: 'solid', color: '#ffffff', show_divider: false },
        footer: { type: 'solid', color: '#2d3748', show_divider: false },
    });

    const [selectedSection, setSelectedSection] = useState('hero');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (data && !error) {
            const logoSetting = data.find(item => item.setting_key === 'logos');
            if (logoSetting && logoSetting.setting_value) {
                setLogos(logoSetting.setting_value);
            }

            const newThemes = { ...themes };
            data.forEach(item => {
                if (item.setting_key.startsWith('theme_')) {
                    const sectionName = item.setting_key.replace('theme_', '');
                    if (newThemes[sectionName]) {
                        newThemes[sectionName] = { ...newThemes[sectionName], ...item.setting_value };
                    }
                }
            });
            setThemes(newThemes);
        }
        setLoading(false);
    };

    const handleLogoUpload = (key, url) => {
        setLogos(prev => ({ ...prev, [key]: url }));
    };

    const handleThemeChange = (key, value) => {
        setThemes(prev => ({
            ...prev,
            [selectedSection]: {
                ...prev[selectedSection],
                [key]: value
            }
        }));
    };

    const saveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        const toastId = toast.loading('Saving theme settings...');

        try {
            let saveError = null;
            if (activeTab === 'logos') {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ setting_key: 'logos', setting_value: logos, updated_at: new Date() }, { onConflict: 'setting_key' });
                saveError = error;
            } else {
                // Save the currently selected section theme
                const settingKey = `theme_${selectedSection}`;
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ setting_key: settingKey, setting_value: themes[selectedSection], updated_at: new Date() }, { onConflict: 'setting_key' });
                saveError = error;
            }

            if (saveError) throw saveError;

            toast.success('Settings saved successfully!', { id: toastId });
        } catch (error) {
            console.error('Save error:', error);
            toast.error(`Error saving settings: ${error.message || 'Unknown error'}`, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading Theme Settings...</div>;

    const currentTheme = themes[selectedSection];

    return (
        <div className="cms-page">
            <h3>Theme & Logos</h3>

            <div className="cms-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                <button
                    className={`cms-btn-primary ${activeTab === 'logos' ? '' : 'outline'}`}
                    onClick={() => setActiveTab('logos')}
                    style={activeTab !== 'logos' ? { background: 'transparent', color: '#000', border: '1px solid #ddd' } : {}}
                    type="button"
                >
                    Logos
                </button>
                <button
                    className={`cms-btn-primary ${activeTab === 'backgrounds' ? '' : 'outline'}`}
                    onClick={() => setActiveTab('backgrounds')}
                    style={activeTab !== 'backgrounds' ? { background: 'transparent', color: '#000', border: '1px solid #ddd' } : {}}
                    type="button"
                >
                    Section Backgrounds
                </button>
            </div>

            <form onSubmit={saveSettings} className="cms-form">
                {activeTab === 'logos' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="form-group">
                            <label>Navbar Desktop Logo</label>
                            <ImageUploader
                                value={logos.navbar_desktop}
                                onChange={(e) => handleLogoUpload('navbar_desktop', e.target.value)}
                                aspect={16 / 9} // General landscape for logos, can use free
                                objectFit="contain"
                                guideText="Recommended: Transparent PNG or SVG. Horizontal layout."
                            />
                        </div>
                        <div className="form-group">
                            <label>Navbar Mobile Logo</label>
                            <ImageUploader
                                value={logos.navbar_mobile}
                                onChange={(e) => handleLogoUpload('navbar_mobile', e.target.value)}
                                aspect={1 / 1}
                                objectFit="contain"
                                guideText="Recommended: Square or short aspect ratio."
                            />
                        </div>
                        <div className="form-group">
                            <label>Footer Logo</label>
                            <ImageUploader
                                value={logos.footer}
                                onChange={(e) => handleLogoUpload('footer', e.target.value)}
                                aspect={16 / 9}
                                objectFit="contain"
                                guideText="Recommended: White/Light transparent PNG or SVG for dark footers."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'backgrounds' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Perbarui Background Untuk Seksi (Pilih Seksi):</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="hero">Hero Section</option>
                                <option value="products">Products Section</option>
                                <option value="promo">Promo Section (Dynamic Promo)</option>
                                <option value="about">About Us Section</option>
                                <option value="footer">Footer Section</option>
                            </select>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', background: '#fcfcfc' }}>
                            <h4 style={{ marginTop: 0 }}>Pengaturan "{selectedSection.toUpperCase()}"</h4>

                            <div className="form-group">
                                <label>Tipe Latar Belakang (Background Type)</label>
                                <select
                                    value={currentTheme.type}
                                    onChange={(e) => handleThemeChange('type', e.target.value)}
                                    style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="solid">Solid Color</option>
                                    <option value="linear_gradient">Linear Gradient</option>
                                    <option value="radial_gradient">Radial Gradient</option>
                                    <option value="image">Background Image</option>
                                </select>
                            </div>

                            {currentTheme.type === 'solid' && (
                                <div className="form-group">
                                    <label>Warna Solid (Hex / RGB)</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input type="color" value={currentTheme.color || '#ffffff'} onChange={(e) => handleThemeChange('color', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                        <input type="text" value={currentTheme.color || ''} onChange={(e) => handleThemeChange('color', e.target.value)} placeholder="#ffffff atau rgb(255,255,255)" style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                                    </div>
                                </div>
                            )}

                            {(currentTheme.type === 'linear_gradient' || currentTheme.type === 'radial_gradient') && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Warna Mulai (Start Color)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input type="color" value={currentTheme.color1 || '#ffffff'} onChange={(e) => handleThemeChange('color1', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                            <input type="text" value={currentTheme.color1 || ''} onChange={(e) => handleThemeChange('color1', e.target.value)} placeholder="#ff0000" style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Warna Akhir (End Color)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input type="color" value={currentTheme.color2 || '#ffffff'} onChange={(e) => handleThemeChange('color2', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                            <input type="text" value={currentTheme.color2 || ''} onChange={(e) => handleThemeChange('color2', e.target.value)} placeholder="#0000ff" style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        </div>
                                    </div>
                                    {currentTheme.type === 'linear_gradient' && (
                                        <div className="form-group">
                                            <label>Sudut (Gradient Angle)</label>
                                            <input type="text" value={currentTheme.angle || '180deg'} onChange={(e) => handleThemeChange('angle', e.target.value)} placeholder="180deg, 45deg, etc" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentTheme.type === 'image' && (
                                <>
                                    <div className="form-group">
                                        <label>Upload Background Image</label>
                                        <ImageUploader
                                            value={currentTheme.image_url}
                                            onChange={(e) => handleThemeChange('image_url', e.target.value)}
                                            aspect={undefined} // Free or unconstrained for backgrounds
                                            guideText="Recommended: High Resolution background image."
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Ukuran Image (Background Size)</label>
                                            <select
                                                value={currentTheme.size || 'cover'}
                                                onChange={(e) => handleThemeChange('size', e.target.value)}
                                                style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="cover">Cover (Menutupi seluruh area)</option>
                                                <option value="contain">Contain (Tetap pada ukuran aslinya)</option>
                                                <option value="auto">Auto (Default)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Pengulangan (Background Repeat)</label>
                                            <select
                                                value={currentTheme.repeat || 'no-repeat'}
                                                onChange={(e) => handleThemeChange('repeat', e.target.value)}
                                                style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="no-repeat">No Repeat (Jangan diulang)</option>
                                                <option value="repeat">Repeat (Ulangi seperti pola/pattern)</option>
                                                <option value="repeat-x">Repeat X (Horizontal)</option>
                                                <option value="repeat-y">Repeat Y (Vertikal)</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-group" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e8f5e9', padding: '1rem', borderRadius: '8px' }}>
                                <input
                                    type="checkbox"
                                    id="show_divider"
                                    checked={currentTheme.show_divider || false}
                                    onChange={(e) => handleThemeChange('show_divider', e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <label htmlFor="show_divider" style={{ margin: 0, cursor: 'pointer', fontWeight: 'bold', color: '#2e7d32' }}>
                                    Aktifkan Section Divider (Pembatas di Bawah Seksi)
                                </label>
                            </div>

                            {currentTheme.show_divider && (
                                <div className="form-row" style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Bentuk Divider (Divider Shape)</label>
                                        <select
                                            value={currentTheme.divider_shape || 'wave'}
                                            onChange={(e) => handleThemeChange('divider_shape', e.target.value)}
                                            style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
                                        >
                                            <option value="wave">Wave (Gelombang)</option>
                                            <option value="curve-up">Curve Up (Melengkung naik)</option>
                                            <option value="curve-down">Curve Down (Melengkung turun)</option>
                                            <option value="triangle">Triangle (Segitiga)</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Warna Divider (Divider Color)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input type="color" value={currentTheme.divider_color || '#ffffff'} onChange={(e) => handleThemeChange('divider_color', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                            <input
                                                type="text"
                                                value={currentTheme.divider_color || '#ffffff'}
                                                onChange={(e) => handleThemeChange('divider_color', e.target.value)}
                                                placeholder="#ffffff"
                                                style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" disabled={saving} className="cms-btn-primary">
                        {saving ? 'Saving...' : `Save ${activeTab === 'logos' ? 'Logos' : 'Selected Background'}`}
                    </button>
                    {activeTab === 'backgrounds' && <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>* Anda memodifikasi tampilan untuk: <strong>{selectedSection.toUpperCase()}</strong>. Tekan save secara berkala per-seksi.</p>}
                </div>
            </form>
        </div>
    );
}
