import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateNote = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoading(true);
            setError("");
            setMessage("");

            await api.post("/api/notes/", { title, content });
            setMessage("Note created");
            setTimeout(() => setMessage(""), 2000)
            setTimeout(() => navigate("/"), 1000)
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Failed to create note");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "30px auto",
                padding: "30px",
                background: "#428c44",
                borderRadius: "20px",
                fontFamily: "system-ui, Arial, sans-serif"
            }}>
            <h2
                style={{
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: "60px",
                    marginBottom: "20px"
                }}>Create note</h2>
            {error &&
                <p
                    style={{
                        color: "red",
                        background: "#ecbec5",
                        padding: "10px",
                        textAlign: "center",
                        borderRadius: "5px",
                        fontSize: "20px"
                    }}>{error}</p>}

            {message &&
                <p
                    style={{
                        color: "green",
                        background: "#b3ded1",
                        padding: "10px",
                        textAlign: "center",
                        borderRadius: "5px",
                        fontSize: "20px"
                    }}>{message}</p>}

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    style={{
                        padding: "15px",
                        fontSize: "20px",
                        borderRadius: "10px",
                        border: "none",
                        outline: "none",
                        background: "rgba(255,255,255,255,0.9)",
                        color: "#333"
                    }} />
                <textarea
                    rows={6}
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                    style={{
                        padding: "15px",
                        fontSize: "20px",
                        borderRadius: "10px",
                        border: "none",
                        outline: "none",
                        background: "rgba(255,255,255,0.9)",
                        color: "#333",
                        resize: "none"
                    }} />

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginTop: "10px"
                }}>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: "#ffffff",
                            color: "#428c44",
                            border: "none",
                            borderRadius: "5px",
                            padding: "15px 30px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}>{loading ? "Submitting" : "Submit"}</button>

                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "#ffffff",
                            color: "#428c44",
                            border: "none",
                            borderRadius: "5px",
                            padding: "15px 30px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default CreateNote;