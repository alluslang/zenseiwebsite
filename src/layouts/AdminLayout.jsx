import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, Info, Link as LinkIcon, LogOut } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/hero', label: 'Hero Section', icon: <ImageIcon size={20} /> },
        { path: '/admin/products', label: 'Products', icon: <ShoppingBag size={20} /> },
        { path: '/admin/about', label: 'About Us', icon: <Info size={20} /> },
        { path: '/admin/social', label: 'Social Links', icon: <LinkIcon size={20} /> },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <img src="/zlogo_white.svg" alt="Zensei Admin" className="sidebar-logo" />
                    <h3>Admin Panel</h3>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="admin-header">
                    <h2>Zensei Content Management</h2>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="view-site-btn">
                        View Live Site
                    </a>
                </header>

                <div className="admin-content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
