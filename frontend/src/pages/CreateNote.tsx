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

            await api.post("/api/notes/", {title, content});
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
        <div>
            <button onClick={() => navigate("/")}>Back</button>
            <form onSubmit={handleSubmit}>
                <h2>Create note</h2>

                {error && <p style={{color: "red"}}>{error}</p>}
                {message && <p style={{color: "green"}}>{message}</p>}

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="text"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting" : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default CreateNote;