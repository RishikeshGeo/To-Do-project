import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from '../api';
import './loginform.css';

const LoginForm = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const endpoint = isLogin ? '/login' : '/user';
            const res = await axios.post(`${API_BASE}${endpoint}`, {
                username,
                password
            });

            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                setMessage('Login successful!')


                //redirect to app
                setTimeout(() => {
                    onLoginSuccess();
                }, 1000);

            } else {
                setMessage('Registration successful! Please log in.');
                setIsLogin(true);
            }

            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    };


    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="auth-input"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />

                    <button type="submit" className="auth-button">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <p className="toggle-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        className="toggle-link"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setMessage('');
                        }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;