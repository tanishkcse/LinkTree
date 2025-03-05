import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,  
                password,
            });

         
            localStorage.setItem('token', response.data.token);

            navigate('/home');
        } catch (error) {
            alert('Invalid credentials'); 
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-lg" style={{ width: '350px' }}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}  
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <span>Don't have an account? </span>
                    <a href="/register" className="text-primary">
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
