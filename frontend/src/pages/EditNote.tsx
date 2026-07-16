import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

// Page for editing note
const EditNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // usestate for storing data
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // usestate for error, message and loading
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);


    useEffect(() => {

        // Function for fetching title and content from database
        const fetchNotes = async () => {
            try {

                // fetch title and content of the note
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

    // Function for updating the note
    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoadingUpdate(true);
            setError("");
            setMessage("");

            // update note in database
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

    // load if fetching notes
    if (loading) return <p
        style={{
            textAlign: "center",
            fontSize: "80px",
            color: "#358938",
            marginTop: "100px",
        }}>Loading...</p>

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
            
            {/* edit note title */}
            <h2
                style={{
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: "60px",
                    marginBottom: "20px"
                }}>Edit Note</h2>

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

            {/* form for updating note */}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>

                {/* title input */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loadingUpdate}
                    style={{
                        padding: "15px",
                        fontSize: "20px",
                        borderRadius: "10px",
                        border: "none",
                        outline: "none",
                        background: "rgba(255,255,255,0.9)",
                        color: "#333"
                    }} />

                {/* content input */}
                <textarea
                    placeholder="Content"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loadingUpdate}
                    style={{
                        padding: "15px",
                        fontSize: "20px",
                        borderRadius: "10px",
                        border: "none",
                        outline: "none",
                        background: "rgba(255,255,255,0.9)",
                        color: "#333",
                        resize: "none"
                    }} />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginTop: "10px"
                    }}>

                    {/* cancel edit button */}
                    <button
                        type="button" onClick={() => navigate("/")}
                        style={{
                            background: "#ffffff",
                            color: "#428c44",
                            border: "none",
                            borderRadius: "5px",
                            padding: "15px 30px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}>Cancel</button>

                    {/* submit button */}
                    <button
                        type="submit"
                        disabled={loadingUpdate}
                        style={{
                            background: "#ffffff",
                            color: "#428c44",
                            border: "none",
                            borderRadius: "5px",
                            padding: "15px 30px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}>
                        {loadingUpdate ? "Editing" : "Edit"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditNote;