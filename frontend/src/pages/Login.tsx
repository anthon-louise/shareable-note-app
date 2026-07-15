import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
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

            await api.post("/api/users/login", { email, password });
            setMessage("User logged in");
            setTimeout(() => navigate("/"), 1000);
            setTimeout(() => setMessage(""), 1000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Login failed");
            setTimeout(() => setError(""), 2500);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
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
                    Login
                </h2>

                {error &&
                    <p
                        style={{
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
                    <p
                        style={{
                            color: "green",
                            background: "#b3ded1",
                            padding: "10px",
                            textAlign: "center",
                            borderRadius: "5px",
                            fontSize: "20px"
                        }}>
                        {message}
                    </p>
                }

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
                    }} />

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
                    }} />

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
                    Login
                </button>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "10px"
                    }}>
                    Don't have an account yet?
                    <Link
                        to="/register"
                        style={{
                            color: "#2844aa",
                            textDecoration: "none"
                        }}>
                        Register...
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Login;