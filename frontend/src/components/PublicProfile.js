import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/user/${username}`);
            setProfile(response.data);
        } catch (err) {
            setError('Failed to fetch profile');
        }
    };

    return (
        <div className="container my-4">
            {error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="card shadow-lg p-4">
                    <div className="text-center">
                        <img
                            src={profile.profilePic}
                            alt="Profile"
                            className="rounded-circle border border-3 border-primary shadow-lg"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <h2 className="mt-3">{profile.username}</h2>
                        <p>{profile.bio}</p>
                    </div>
                    <div className="mt-4">
                        <h3>Links</h3>
                        {profile.links && profile.links.length > 0 ? (
                            profile.links.map((link) => (
                                <div key={link._id} className="card mb-2">
                                    <div className="card-body">
                                        <h5>{link.title}</h5>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            {link.url}
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No links available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicProfile;