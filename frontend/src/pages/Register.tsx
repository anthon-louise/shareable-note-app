import { useState } from "react";
import api from "../api/axios";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            await api.post('/api/users/register', {username, email, password});
            setMessage("User created")
            setTimeout(() => setMessage(""), 2500);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Registration failed")
            setTimeout(() => setError(""), 2500);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>

                {error && <p style={{color: "red"}}>{error}</p>}
                {message && <p style={{color: "green"}}>{message}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                
                <button type="submit" disabled={loading}>Register</button>
            </form>
        </div>
    );
}

export default Register