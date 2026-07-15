import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

interface Note {
    id: number,
    user_id: number,
    title: string,
    content: string,
    created_at: string,
    updated_at: string,
    username?: string
}

const Note = () => {
    const navigate = useNavigate();

    const [notes, setNotes] = useState<Note[]>([]);
    const [notesSharedWithMe, setNotesSharedWithMe] = useState<Note[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingShared, setLoadingShared] = useState(true);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        fetchNotes();
        fetchNotesSharedWithMe();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get("/api/notes");
            setNotes(res.data.notes);
        } catch {
            setError("Failed to fetch notes");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoading(false);
        }
    }

    const fetchNotesSharedWithMe = async () => {
        try {
            const res = await api.get("/api/notes/sharedwithme");
            setNotesSharedWithMe(res.data.notes);
        } catch {
            setError("Failed to fetch notes by others");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingShared(false);
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

    const handleDelete = async (id: number) => {
        try {
            setError("");
            setMessage("");
            setLoadingDelete(true);

            await api.delete(`/api/notes/${id}`);
            await fetchNotes();
            setMessage("Delete successfully");
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setError("Failed to delete note");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingDelete(false);
        }
    };

    if (loading) return <p
        style={{
            textAlign: "center",
            fontSize: "80px",
            color: "#358938",
            marginTop: "100px",
        }}>
        Loading...
    </p>

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
                    fontSize: "70px",
                    marginBottom: "30px"
                }}>
                My notes
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

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    marginBottom: "30px",
                    flexWrap: "wrap"
                }}>

                <button
                    onClick={() => navigate("/create")}
                    style={{
                        background: "#ffffff",
                        color: "#428c44",
                        border: "none",
                        borderRadius: "5px",
                        padding: "15px 30px",
                        fontSize: "20px",
                        cursor: "pointer"
                    }}>Create note</button>

                <button
                    onClick={handleLogout}
                    disabled={loadingLogout}
                    style={{
                        background: "#ffffff",
                        color: "#428c44",
                        border: "none",
                        borderRadius: "5px",
                        padding: "15px 30px",
                        fontSize: "20px",
                        cursor: "pointer"
                    }}>{loadingLogout ? "Logging out" : "Logout"}</button>
            </div>


            {notes.length === 0 ? (
                <p
                    style={{
                        textAlign: "center",
                        color: "#ffffff",
                        fontSize: "20px",
                        padding: "30px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "15px"
                    }}>No notes yet.</p>
            ) : (
                notes.map((note) => (
                    <div
                        key={note.id}
                        style={{
                            background: "#ffffff",
                            borderRadius: "15px",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                        <h3 style={{
                            color: "#2b473f",
                            fontSize: "25px",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px"
                        }}>
                            {note.title}
                            <span style={{
                                display: "flex",
                                gap: "8px",
                                marginLeft: "auto"
                            }}>
                                <button
                                    onClick={() => navigate(`/edit/${note.id}`)}
                                    style={{
                                        background: "#1f2a9e",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "10px 15px",
                                        fontSize: "20px",
                                        cursor: "pointer"
                                    }}>Edit</button>
                                <button
                                    disabled={loadingDelete}
                                    onClick={() => handleDelete(note.id)}
                                    style={{
                                        background: "#d33131",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "10px 15px",
                                        fontSize: "20px",
                                        cursor: "pointer"
                                    }}
                                >Delete</button>
                                <button
                                    onClick={() => navigate(`/${note.id}/shares`)}
                                    style={{
                                        background: "#65108d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "10px 15px",
                                        fontSize: "20px",
                                        cursor: "pointer"
                                    }}
                                >View</button>
                            </span>
                        </h3>

                        <p style={{
                            color: "#555",
                            fontSize: "20px",
                            lineHeight: "1.6"
                        }}>{note.content}</p>

                    </div>
                ))
            )}


            <br /> <br />

            <h4
                style={{
                    color: "#ffffff",
                    fontSize: "30px",
                    textAlign: "center",
                    marginBottom: "20px"
                }}>Notes shared by others:</h4>
            {loadingShared ? (
                <p
                    style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: "20px",
                        padding: "20px",
                        background: "rgba(255,255,255,0.1",
                        borderRadius: "10px"
                    }}>Loading shared notes by others</p>
            ) : notesSharedWithMe.length === 0 ? (
                <p
                    style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: "20px",
                        padding: "20px",
                        background: "rgba(255,255,255,0.1",
                        borderRadius: "10px"
                    }}>No shared notes by others yet</p>
            ) : (notesSharedWithMe.map((note) => (
                <div
                    key={note.id}
                    style={{
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: "15px",
                        padding: "20px",
                        marginBottom: "5px"
                    }}>
                    <h5
                        style={{
                            color: "#ffffff",
                            fontSize: "20px",
                            marginBottom: "5px"
                        }}>{note.title}</h5>
                    <p
                        style={{
                            color: "#e8f5e9",
                            fontSize: "20px"
                        }}>{note.content}
                        <span style={{
                            fontStyle: "italic",
                            opacity: "0.8",
                            fontSize: "12px",
                            float: "right",
                            marginTop: "40px"
                        }}> by {note.username}</span>
                    </p>
                </div>
            ))
            )}
        </div>
    )
}

export default Note