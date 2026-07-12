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
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState("");
    

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/api/notes");
                setNotes(res.data.notes);
            } catch (err: any) {
                setError("Failed to fetch notes")
            } 
        }
        fetchNotes();

        console.log(notes);
    }, []);

    return (
        <div>
            {notes.map((note) => (
                <div key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    )
}

export default Note