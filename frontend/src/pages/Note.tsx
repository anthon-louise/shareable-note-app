import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

interface Note {
    id: number,
    user_id: number,
    title: string,
    content: string,
    created_at: string,
    updated_at: string
}

const Note = () => {
    const navigate = useNavigate();

    const [notes, setNotes] = useState<Note[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    

    useEffect(() => {
        fetchNotes();
    }, []);

            const fetchNotes = async () => {
            try {
                const res = await api.get("/api/notes");
                setNotes(res.data.notes);
            } catch {
                setError("Failed to fetch notes")
            } finally {
                setLoading(false);
            }
        }

    const handleLogout = async () => {
        try {
            setLoadingLogout(true);
            setError("");
            setMessage("");

            await api.post("/api/users/logout");
            navigate("/login");
        } catch {
            setError("Logout failed");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingLogout(false);
        }
    };

    const handleDelete =  async (id: number) => {
        try {
            setError("");
            setMessage("");
            setLoadingDelete(true);

            await api.delete(`/api/notes/${id}`);
            fetchNotes();
            setMessage("Delete successfully");
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setError("Failed to delete note");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingDelete(false);
        }
    };

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h2>My notes</h2>

            {error && <p style={{color: "red"}}>{error}</p>}
            {message && <p style={{color: "green"}}>{message}</p>}

            <button onClick={() => navigate("/create")}>Create note</button>
            <button onClick={handleLogout} disabled={loadingLogout}>Logout</button>
            
            {notes.length === 0 && <p>No notes yet.</p>}

            {notes.map((note) => (
                <div key={note.id}>
                    <h3>{note.title} <button onClick={() => navigate(`/edit/${note.id}`)}>📝</button> <button onClick={() => handleDelete(note.id)}>🗑️</button></h3>
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    )
}

export default Note