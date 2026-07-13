import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const EditNote = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
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

            await api.put(`/api/notes/${id}`, {title, content});
            navigate("/");
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
            {error && <p style={{color: "red"}}>{error}</p>}
                <form onSubmit={handleSubmit}>
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
                    <button type="button" onClick={() => navigate("/")}>Cancel</button>
                    <button type="submit" disabled={loadingUpdate}>Edit</button>
                </form>
        </div>
    )
}

export default EditNote;