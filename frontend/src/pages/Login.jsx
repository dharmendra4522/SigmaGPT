import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
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
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Login to SigmaGPT</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type='text'
                    placeholder='Username'
                    style={styles.input}
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                />
                <input
                    type='password'
                    placeholder='Password'
                    style={styles.input}
                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
                <button type='submit' style={styles.button} disabled={loading}>
                    {loading ? "Logging In..." : "Login"}
                </button>
                <p style={styles.linkText}>
                    Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#212121' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px', backgroundColor: '#333', borderRadius: '8px', color: 'white', minWidth: '300px' },
    title: { textAlign: 'center', marginBottom: '10px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: 'white' },
    button: { padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#5e5ce5', color: 'white', cursor: 'pointer', fontSize: '16px' },
    linkText: { textAlign: 'center', marginTop: '10px', fontSize: '14px' },
    link: { color: '#5e5ce5', textDecoration: 'none' },
    error: { backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#ff8a8a', padding: '10px', borderRadius: '4px', textAlign: 'center', border: '1px solid red' }
};