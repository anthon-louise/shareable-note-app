import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Shared = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [error, SetError] = useState("");
    const [email, setEmail] = useState("");

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
            SetError("Failed to fetch notes");
            setTimeout(() => SetError(""), 2000);
        }
    }

    const handleDelete = async (userId: number) => {
        try {
            await api.delete(`/api/notes/${id}/share/${userId}`)
            fetchNotes();
        } catch {
            SetError("Handle delete failed");
        }
    }

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();

            await api.post(`/api/notes/${id}/share`, {email});
            
        } catch (err: any) {
            console.log(err.response.data);
        }
    }

    return (
        <div>
            <button onClick={() => navigate("/")}>Back</button>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button>Share</button>
            </form>

            {notes.length === 0 ? (
                <p>This notes is note shared</p>
            ) : (
                <div>
                    <h3>Notes shared by others:</h3>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {notes.map((note) => (
                        <div key={note.id}>
                            <p>{note.email} <button onClick={() => handleDelete(note.shared_with_user_id)}>🗑️</button></p>
                        </div>))}
                </div>)
            }
        </div>
    )
}

export default Shared