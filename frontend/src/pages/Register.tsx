import { useState } from "react";
import { Link } from "react-router-dom";
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

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await api.post('/api/users/register', { username, email, password });
            setMessage("User created")
            setTimeout(() => setMessage(""), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Registration failed")
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "30px",
                background: "#428c44",
                border: "none",
                borderRadius: "20px"
            }}>

            <form onSubmit={handleSubmit}>
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "24px",
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "60px"
                    }}>
                    Register
                </h2>

                {error &&
                    <p style={{
                        color: "red",
                        background: "#ecbec5",
                        padding: "10px",
                        textAlign: "center",
                        borderRadius: "5px",
                        fontSize: "20px"
                    }}>
                        {error}
                    </p>
                }
                
                {message &&
                    <p style={{
                        color: "green",
                        background: "#b3ded1",
                        padding: "10px",
                        textAlign: "center",
                        borderRadius: "5px",
                        fontSize: "20px"
                    }}>
                        {message}
                    </p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 15px",
                        margin: "10px 0",
                        border: "none",
                        borderRadius: "5px",
                        boxSizing: "border-box",
                        fontSize: "20px",
                        color: "#2b473f"
                    }}
                />

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 15px",
                        margin: "10px 0",
                        border: "none",
                        borderRadius: "5px",
                        boxSizing: "border-box",
                        fontSize: "20px",
                        color: "#2b473f"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 15px",
                        margin: "10px 0",
                        border: "none",
                        borderRadius: "5px",
                        boxSizing: "border-box",
                        fontSize: "20px",
                        color: "#2b473f"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "50%",
                        margin: "20px auto 0 auto",
                        display: "block",
                        color: "#428c44",
                        fontSize: "20px",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px"
                    }}>
                    Register
                </button>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "10px"
                    }}>
                    Already have an account?
                    <Link
                        to="/login"
                        style={{
                            color: "#2844aa",
                            textDecoration: "none"
                        }}>
                        Login...
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Register