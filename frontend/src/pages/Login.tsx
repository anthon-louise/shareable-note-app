import { useState } from "react";
import api from "../api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();

            setLoading(true);
            setError("");
            setMessage("");

            await api.post("/api/users/login", {email, password});
            setMessage("User logged in");
            setTimeout(() => setMessage(""), 2500);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Login failed");
            setTimeout(() => setError(""), 2500);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

                {error && <p style={{color: "red"}}>{error}</p>}
                {message && <p style={{color: "green"}}>{message}</p>}

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

                <button type="submit" disabled={loading}>Login</button>
            </form>
        </div>
    )
}

export default Login;