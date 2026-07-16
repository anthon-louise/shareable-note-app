import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

// defines the note object
interface Note {
    id: number,
    user_id: number,
    title: string,
    content: string,
    created_at: string,
    updated_at: string,
    username?: string
}

// Page for note list and shared notes list
const Note = () => {
    const navigate = useNavigate();

    // usestates for storing data
    const [notes, setNotes] = useState<Note[]>([]);
    const [notesSharedWithMe, setNotesSharedWithMe] = useState<Note[]>([]);

    // usestates for message, error and loading
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingShared, setLoadingShared] = useState(true);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // fetch notes when component mounts
    useEffect(() => {
        fetchNotes();
        fetchNotesSharedWithMe();
    }, []);

    // Function for fetching notes
    const fetchNotes = async () => {
        try {

            // fetch note from database
            const res = await api.get("/api/notes");

            setNotes(res.data.notes);
        } catch {
            setError("Failed to fetch notes");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoading(false);
        }
    }

    // Function for fetching notes shared with me
    const fetchNotesSharedWithMe = async () => {
        try {

            // fetch notes shared with me from database
            const res = await api.get("/api/notes/sharedwithme");

            setNotesSharedWithMe(res.data.notes);
        } catch {
            setError("Failed to fetch notes by others");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingShared(false);
        }
    }

    // FUnction for user logout
    const handleLogout = async () => {
        try {
            setLoadingLogout(true);
            setError("");
            setMessage("");

            // clears the token in cookie
            await api.post("/api/users/logout");
            navigate("/login");
        } catch {
            setError("Logout failed");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingLogout(false);
        }
    };

    // Function for note deletion
    const handleDelete = async (id: number) => {
        try {
            setError("");
            setMessage("");
            setLoadingDelete(true);

            // delete note in database
            await api.delete(`/api/notes/${id}`);

            // refresh notes after deletion
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


    // if fetching notes then loading
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

            {/* my notes title */}
            <h2
                style={{
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: "70px",
                    marginBottom: "30px"
                }}>My notes</h2>

            {/* error notification */}
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

            {/* message notification */}
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

                {/* navigate to create page */}
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

                {/* logout button */}
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

            {/* if notes is empty display empty message */}
            {/* is notes is note emprt then display list */}
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

                        {/* note title */}
                        <h3 style={{
                            color: "#2b473f",
                            fontSize: "25px",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px"
                        }}>{note.title}
                            <span style={{
                                display: "flex",
                                gap: "8px",
                                marginLeft: "auto"
                            }}>

                                {/* navigate to edit for specific note */}
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

                                {/* delete a specific note button */}
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
                                    }}>Delete</button>

                                {/* navigate to shared users page */}
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
                                    }}>View</button>
                            </span>
                        </h3>

                        {/* note content */}
                        <p style={{
                            color: "#555",
                            fontSize: "20px",
                            lineHeight: "1.6"
                        }}>{note.content}</p>

                    </div>
                ))
            )}


            <br /> <br />

            {/* noteshared by others title */}
            <h4
                style={{
                    color: "#ffffff",
                    fontSize: "30px",
                    textAlign: "center",
                    marginBottom: "20px"
                }}>Notes shared by others:</h4>

            {/* if loading fetch notes shared by others then display loading message */}
            {/* if notes shared by others is empty then display empty message */}
            {/* if notes shared by others is not empty then show list */}
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
                            display: "flex",
                            justifyContent: "flex-end",
                            fontSize: "14px",
                            color: "#c8e6c9",
                            fontStyle: "italic",
                            opacity: "0.8",
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            paddingTop: "8px",
                            marginTop: "8px"
                        }}> by {note.username}</span>
                    </p>
                </div>
            ))
            )}
        </div>
    )
}

export default Note