import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, LogOut, Edit, X, Home, User, Save, Check } from 'lucide-react';

const Admin = () => {
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState({ title: '', bio: '', logoUrl: '', profileImageUrl: '' });
    const [activeTab, setActiveTab] = useState('skills');
    const [isDirty, setIsDirty] = useState(false);
    const navigate = useNavigate();

    // Form states
    const [newSkill, setNewSkill] = useState({ name: '', level: '', imageUrl: '' });
    const [newProject, setNewProject] = useState({ title: '', description: '', githubUrl: '', liveUrl: '', imageUrl: '' });

    // Edit state
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const skillsSnapshot = await getDocs(collection(db, 'skills'));
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const profileDoc = await getDoc(doc(db, 'profile', 'main'));

        setSkills(skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        if (profileDoc.exists()) {
            setProfile(profileDoc.data());
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const addSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.name) return;
        await addDoc(collection(db, 'skills'), newSkill);
        setNewSkill({ name: '', level: '', imageUrl: '' });
        fetchData();
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (!newProject.title) return;

        if (editingProject) {
            await updateDoc(doc(db, 'projects', editingProject.id), newProject);
            setEditingProject(null);
        } else {
            await addDoc(collection(db, 'projects'), newProject);
        }

        setNewProject({ title: '', description: '', githubUrl: '', liveUrl: '', imageUrl: '' });
        fetchData();
    };

    const handleProfileChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
        setIsDirty(true);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        await setDoc(doc(db, 'profile', 'main'), profile);
        setIsDirty(false);
        // Optional: Show a brief "Saved!" toast or keep the "Saved" button state
    };

    const startEditProject = (project) => {
        setEditingProject(project);
        setNewProject(project);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setNewProject({ title: '', description: '', githubUrl: '', liveUrl: '', imageUrl: '' });
    };

    const handleDelete = async (collectionName, id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await deleteDoc(doc(db, collectionName, id));
            fetchData();
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/" className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', display: 'flex', gap: '0.5rem' }}>
                            <Home size={18} /> Back to Home
                        </Link>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Admin Dashboard</h1>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: '#ef4444', display: 'flex', gap: '0.5rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`btn ${activeTab === 'skills' ? 'btn-primary' : ''}`}
                        style={{ backgroundColor: activeTab !== 'skills' ? 'var(--bg-secondary)' : undefined }}
                    >
                        Manage Skills
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`btn ${activeTab === 'projects' ? 'btn-primary' : ''}`}
                        style={{ backgroundColor: activeTab !== 'projects' ? 'var(--bg-secondary)' : undefined }}
                    >
                        Manage Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`btn ${activeTab === 'profile' ? 'btn-primary' : ''}`}
                        style={{ backgroundColor: activeTab !== 'profile' ? 'var(--bg-secondary)' : undefined }}
                    >
                        Manage Profile
                    </button>
                </div>

                {activeTab === 'skills' && (
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 2fr' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Add New Skill</h3>
                            <form onSubmit={addSkill}>
                                <div className="form-group">
                                    <label className="form-label">Skill Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                        placeholder="e.g., React"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Proficiency Level</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSkill.level}
                                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                        placeholder="e.g., Advanced"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Icon/Image URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSkill.imageUrl}
                                        onChange={(e) => setNewSkill({ ...newSkill, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Skill
                                </button>
                            </form>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Existing Skills</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {skills.map((skill) => (
                                    <div key={skill.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {skill.imageUrl && (
                                                <img src={skill.imageUrl} alt={skill.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                            )}
                                            <div>
                                                <span style={{ fontWeight: '600', display: 'block' }}>{skill.name}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{skill.level}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete('skills', skill.id)}
                                            style={{ color: '#ef4444', background: 'none', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 2fr' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h3>
                            <form onSubmit={handleProjectSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        rows="3"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProject.imageUrl}
                                        onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProject.githubUrl}
                                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Live URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProject.liveUrl}
                                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        {editingProject ? <Edit size={18} style={{ marginRight: '0.5rem' }} /> : <Plus size={18} style={{ marginRight: '0.5rem' }} />}
                                        {editingProject ? 'Update Project' : 'Add Project'}
                                    </button>
                                    {editingProject && (
                                        <button type="button" onClick={cancelEdit} className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Existing Projects</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {projects.map((project) => (
                                    <div key={project.id} style={{
                                        padding: '1rem',
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontWeight: '600' }}>{project.title}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => startEditProject(project)}
                                                    style={{ color: 'var(--accent-color)', background: 'none' }}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete('projects', project.id)}
                                                    style={{ color: '#ef4444', background: 'none' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{project.description}</p>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {project.githubUrl && <span style={{ marginRight: '1rem' }}>GitHub: Yes</span>}
                                            {project.liveUrl && <span>Live: Yes</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Edit Profile Details</h3>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="form-group">
                                <label className="form-label">Hero Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile.title}
                                    onChange={(e) => handleProfileChange('title', e.target.value)}
                                    placeholder="e.g., Building digital experiences."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bio / Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows="4"
                                    value={profile.bio}
                                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                                    placeholder="I'm a passionate developer..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Profile Image URL (Hero Section)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile.profileImageUrl}
                                    onChange={(e) => handleProfileChange('profileImageUrl', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Logo Image URL (Navbar)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile.logoUrl}
                                    onChange={(e) => handleProfileChange('logoUrl', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: '100%',
                                    backgroundColor: isDirty ? 'var(--accent-color)' : '#10b981',
                                    color: '#fff',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isDirty ? (
                                    <>
                                        <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} style={{ marginRight: '0.5rem' }} /> Saved
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
