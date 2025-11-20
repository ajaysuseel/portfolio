import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, Cpu, Briefcase } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const fetchLogo = async () => {
            try {
                const profileDoc = await getDoc(doc(db, 'profile', 'main'));
                if (profileDoc.exists() && profileDoc.data().logoUrl) {
                    setLogoUrl(profileDoc.data().logoUrl);
                }
            } catch (error) {
                console.error("Error fetching logo:", error);
            }
        };
        fetchLogo();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: '1.5rem 0',
            transition: 'all 0.3s ease',
            backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                    ) : (
                        <>Portfolio<span style={{ color: 'var(--accent-color)' }}>.</span></>
                    )}
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button onClick={() => scrollToSection('bio')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} /> Bio
                    </button>
                    <button onClick={() => scrollToSection('skills')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Cpu size={18} /> Skills
                    </button>
                    <button onClick={() => scrollToSection('projects')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={18} /> Projects
                    </button>
                    <Link to="/login" style={{ color: 'var(--text-secondary)', opacity: 0.5, transition: 'opacity 0.3s' }} className="hover:opacity-100">
                        <Lock size={16} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
