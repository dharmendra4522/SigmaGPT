import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const Login = () => {
    const [inputs, setInputs] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://sigmagpt-api.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Login to SigmaGPT</h2>
                {error && <p className="auth-error">{error}</p>}
                <input
                    type='text'
                    placeholder='Username'
                    className="auth-input"
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                />
                <input
                    type='password'
                    placeholder='Password'
                    className="auth-input"
                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
                <button type='submit' className="auth-button" disabled={loading}>
                    {loading ? "Logging In..." : "Login"}
                </button>
                <p className="auth-link-text">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;

