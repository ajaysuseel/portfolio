import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Github, ExternalLink, Code, User, Briefcase } from 'lucide-react';

const Home = () => {
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState({ title: '', bio: '', profileImageUrl: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skillsSnapshot = await getDocs(collection(db, 'skills'));
                const projectsSnapshot = await getDocs(collection(db, 'projects'));
                const profileDoc = await getDoc(doc(db, 'profile', 'main'));

                setSkills(skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                if (profileDoc.exists()) {
                    setProfile(profileDoc.data());
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--bg-card)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <Navbar />

            {/* Hero / Bio Section */}
            <section id="bio" className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        gap: '3rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        '@media (min-width: 768px)': { flexDirection: 'row' }
                    }}>
                        <div style={{ maxWidth: '800px', flex: 1 }}>
                            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '2rem' }}>
                                <span style={{
                                    background: 'linear-gradient(to right, var(--accent-color), #a5b4fc)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {profile.title || "Building digital experiences."}
                                </span>
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}>
                                {profile.bio || "I'm a passionate developer focused on creating beautiful, responsive, and user-friendly applications. I turn complex problems into elegant solutions."}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">
                                    View Work
                                </button>
                                <button onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                                    My Skills
                                </button>
                            </div>
                        </div>

                        {profile.profileImageUrl && (
                            <div style={{ flexShrink: 0 }}>
                                <img
                                    src={profile.profileImageUrl}
                                    alt="Profile"
                                    style={{
                                        width: '250px',
                                        height: '250px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid var(--bg-card)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="section-title">Technical Skills</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '2rem' }}>
                        {skills.map((skill) => (
                            <div key={skill.id} className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ marginBottom: '1rem', color: 'var(--accent-color)', display: 'flex', justifyContent: 'center' }}>
                                    {skill.imageUrl ? (
                                        <img src={skill.imageUrl} alt={skill.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                                    ) : (
                                        <Code size={32} />
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{skill.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{skill.level || 'Proficient'}</p>
                            </div>
                        ))}
                        {skills.length === 0 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No skills added yet.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="section">
                <div className="container">
                    <h2 className="section-title">Featured Projects</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {projects.map((project) => (
                            <div key={project.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                {project.imageUrl && (
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                                    </div>
                                )}
                                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{project.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>{project.description}</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', ':hover': { color: 'var(--accent-color)' } }}>
                                                <Github size={18} /> Code
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-color)' }}>
                                                <ExternalLink size={18} /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No projects added yet.</p>
                        )}
                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
