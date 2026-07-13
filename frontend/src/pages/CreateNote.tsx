import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateNote = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setError("");

            await api.post("/api/notes/", {title, content});
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Failed to create note");
            setTimeout(() => setError(""), 1400);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Create note</h2>

                {error && <p style={{color: "red"}}>{error}</p>}

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateNote;