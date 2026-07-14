import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Shared = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [email, setEmail] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loadingShares, setLoadingShares] = useState(true);
    const [loadingShare, setLoadingShare] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);


    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get(`/api/notes/${id}/shares`)
            setNotes(res.data.shared_with)
        } catch {
            setError("Failed to fetch notes");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingShares(false);
        }
    }

    const handleDelete = async (userId: number) => {
        try {
            setLoadingDelete(true);
            setMessage("");
            setError("");

            await api.delete(`/api/notes/${id}/share/${userId}`)
            await fetchNotes();
            setMessage("Share deleted");
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setError("Handle delete failed");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingDelete(false);
        }
    }

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoadingShare(true);
            setMessage("");
            setError("");

            await api.post(`/api/notes/${id}/share`, { email });
            setEmail("");
            await fetchNotes();
            setMessage("Note shared");
            setTimeout(() => setMessage(""), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Failed to share note");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingShare(false);
        }
    }

    if (loadingShares) return <p>Loading...</p>

    return (
        <div>
            <button onClick={() => navigate("/")}>Back</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loadingShare}
                />
                <button disabled={loadingShare}>
                    {loadingShare ? "Sharing" : "Share"}
                </button>
            </form>

            {notes.length === 0 ? (
                <p>This notes is not shared</p>
            ) : (
                <div>
                    <h3>Notes shared with:</h3>

                    {notes.map((note) => (
                        <div key={note.id}>
                            <p>{note.email} <button disabled={loadingDelete} onClick={() => handleDelete(note.shared_with_user_id)}>🗑️</button></p>
                        </div>))}
                </div>)
            }
        </div>
    )
}

export default Shared