

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Home = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState({});
    const [newPostText, setNewPostText] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedBio, setUpdatedBio] = useState('');
    const [updatedProfilePic, setUpdatedProfilePic] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            setIsLoggedIn(true);
            fetchProfile();
            fetchPosts();
        }
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProfile(response.data);
        } catch (err) {
            console.error('Error fetching profile', err);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setPosts(response.data);
        } catch (err) {
            console.error('Error fetching posts', err);
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

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText || !newPostImage) {
            setError('Please provide text and an image URL for the post.');
            return;
        }

        const postData = { caption: newPostText, image: newPostImage };
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts/create`, postData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setPosts([response.data.post, ...posts]);
            setNewPostText('');
            setNewPostImage('');
            setError('');
        } catch (err) {
            setError('Failed to create post, please try again.');
        }
    };

    const handleUpdatePost = async (postId, newText) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`,
                { caption: newText },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchPosts();
        } catch (err) {
            console.error('Error updating post', err);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setPosts(posts.filter((post) => post._id !== postId));
        } catch (err) {
            console.error('Error deleting post', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="container my-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-center mb-4">Social Media Dashboard</h2>
                {isLoggedIn ? (
                    <>
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
                            <h3>Create a New Post</h3>
                            <form onSubmit={handleCreatePost}>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="form-group">
                                    <label>Post Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newPostText}
                                        onChange={(e) => setNewPostText(e.target.value)}
                                        placeholder="What's on your mind?"
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Post Image URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newPostImage}
                                        onChange={(e) => setNewPostImage(e.target.value)}
                                        placeholder="Enter image URL"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-3">
                                    Create Post
                                </button>
                            </form>
                        </div>

                        <div>
                            <h3>Recent Posts</h3>
                            <div>
                                {posts.length === 0 ? (
                                    <p>No posts available. Create one above!</p>
                                ) : (
                                    posts.map((post) => (
                                        <div key={post._id} className="card mb-3">
                                            <div className="card-body">
                                                <h5>{post.caption}</h5>
                                                <img src={post.image} alt="Post" className="img-fluid" />
                                                {post.user === profile._id && (
                                                    <div className="d-flex justify-content-between mt-3">
                                                        <button
                                                            className="btn btn-warning"
                                                            onClick={() => {
                                                                const newText = prompt('Enter new caption:', post.caption);
                                                                if (newText) handleUpdatePost(post._id, newText);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeletePost(post._id)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button onClick={handleLogout} className="btn btn-danger px-4 mt-4">
                            Logout
                        </button>
                    </>
                ) : (
                    <p className="text-center">Please log in to access the Social Media Dashboard.</p>
                )}
            </div>
        </div>
    );
};

export default Home;




