import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [links, setLinks] = useState([]);
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkURL, setNewLinkURL] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedBio, setUpdatedBio] = useState('');
    const [updatedProfilePic, setUpdatedProfilePic] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProfile(response.data);
            setLinks(response.data.links);
        } catch (err) {
            console.error('Error fetching profile', err);
        }
    };

    const handleAddLink = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/links/add`,
                { title: newLinkTitle, url: newLinkURL },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setLinks(response.data.links);
            setNewLinkTitle('');
            setNewLinkURL('');
        } catch (err) {
            console.error('Error adding link', err);
        }
    };

    const handleEditLink = async (linkId, title, url) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/links/edit/${linkId}`,
                { title, url },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setLinks(response.data.links);
        } catch (err) {
            console.error('Error editing link', err);
        }
    };

    const handleDeleteLink = async (linkId) => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/links/delete/${linkId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setLinks(response.data.links);
        } catch (err) {
            console.error('Error deleting link', err);
        }
    };

    const handleReorderLinks = async (newOrder) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/links/reorder`,
                { links: newOrder },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setLinks(response.data.links);
        } catch (err) {
            console.error('Error reordering links', err);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const updatedProfile = {
                username: updatedUsername,
                bio: updatedBio,
                profilePic: updatedProfilePic,
            };

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/profile/update`, updatedProfile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setProfile(response.data.user);
            setEditMode(false);
        } catch (err) {
            console.error('Error updating profile', err);
            alert('Failed to update profile, please try again.');
        }
    };

    return (
        <div className="container my-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-center mb-4">Profile</h2>
                <div className="mb-4">
                    <h3>User Profile</h3>
                    <div className="card p-3">
                        <img
                            src={profile.profilePic}
                            alt="Profile"
                            className="rounded-circle border border-3 border-primary shadow-lg"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <h4>{profile.username}</h4>
                        <p>{profile.bio}</p>
                        <button
                            className="btn btn-warning mt-2"
                            onClick={() => {
                                setEditMode(true);
                                setUpdatedUsername(profile.username);
                                setUpdatedBio(profile.bio);
                                setUpdatedProfilePic(profile.profilePic);
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {editMode && (
                    <div className="card p-3 mt-3">
                        <h3>Edit Profile</h3>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedUsername}
                                onChange={(e) => setUpdatedUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label>Bio</label>
                            <textarea
                                className="form-control"
                                value={updatedBio}
                                onChange={(e) => setUpdatedBio(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label>Profile Picture URL</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedProfilePic}
                                onChange={(e) => setUpdatedProfilePic(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-success mt-3" onClick={handleUpdateProfile}>
                            Save Changes
                        </button>
                        <button className="btn btn-secondary mt-3 ms-2" onClick={() => setEditMode(false)}>
                            Cancel
                        </button>
                    </div>
                )}

                <div className="mb-4">
                    <h3>Manage Links</h3>
                    <div className="form-group">
                        <label>Link Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newLinkTitle}
                            onChange={(e) => setNewLinkTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Link URL</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newLinkURL}
                            onChange={(e) => setNewLinkURL(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleAddLink}>
                        Add Link
                    </button>
                    <div className="mt-4">
                        {links.map((link, index) => (
                            <div key={link._id} className="card mb-2">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>{link.title}</h5>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            {link.url}
                                        </a>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => {
                                                const newTitle = prompt('Enter new title:', link.title);
                                                const newURL = prompt('Enter new URL:', link.url);
                                                if (newTitle && newURL) handleEditLink(link._id, newTitle, newURL);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteLink(link._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;