import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const EditNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get(`/api/notes/${id}`);
                setTitle(res.data.note.title);
                setContent(res.data.note.content);
            } catch (err: any) {
                setError("Failed to fetch note")
                setTimeout(() => setError(""), 2000)
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [id])

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoadingUpdate(true);
            setError("");
            setMessage("");

            await api.put(`/api/notes/${id}`, { title, content });
            setMessage("Note edited")
            setTimeout(() => navigate("/"), 1000);
            setTimeout(() => setMessage(""), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Failed to updated notes");
            setTimeout(() => setError(""), 2000)
        } finally {
            setLoadingUpdate(false);
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loadingUpdate}
                />

                <input
                    type="text"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loadingUpdate}
                />
                <button type="button" onClick={() => navigate("/")}>Cancel</button>
                <button type="submit" disabled={loadingUpdate}>
                    {loadingUpdate ? "Editing" : "Edit"}
                </button>
            </form>
        </div>
    )
}

export default EditNote;