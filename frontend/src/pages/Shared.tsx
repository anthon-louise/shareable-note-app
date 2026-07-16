import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Page for sharing note and viewing the list of shared people
const Shared = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // usestate for storing data
    const [notes, setNotes] = useState<any[]>([]);
    const [email, setEmail] = useState("");

    // usestate for message, error and loading
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loadingShares, setLoadingShares] = useState(true);
    const [loadingShare, setLoadingShare] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // refetch every mount
    useEffect(() => {
        fetchNotes();
    }, []);

    // Function for fetching users who are shared with
    const fetchNotes = async () => {
        try {

            // get the users who are shared with in database
            const res = await api.get(`/api/notes/${id}/shares`)

            setNotes(res.data.shared_with)
        } catch {
            setError("Failed to fetch notes");
            setTimeout(() => setError(""), 2000);
        } finally {
            setLoadingShares(false);
        }
    }

    // Function for removing share
    const handleDelete = async (userId: number) => {
        try {
            setLoadingDelete(true);
            setMessage("");
            setError("");

            // removing share in database
            await api.delete(`/api/notes/${id}/share/${userId}`)

            // refetch notes
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

    // Function for sharing note to another user
    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoadingShare(true);
            setMessage("");
            setError("");

            // share note to another user
            await api.post(`/api/notes/${id}/share`, { email });

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

    // if user shares is loading then display loading message
    if (loadingShares) return <p
        style={{
            textAlign: "center",
            fontSize: "80px",
            color: "#358938",
            marginTop: "100px"
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

            {/* share note title */}
            <h2 style={{
                textAlign: "center",
                color: "#ffffff",
                fontSize: "60px",
                marginBottom: "20px"
            }}>Share Note</h2>

            {/* error notification */}
            {error && <p
                style={{
                    color: "red",
                    background: "#ecbec5",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontSize: "20px"
                }}>{error}</p>}

            {/* message notification */}
            {message && <p
                style={{
                    color: "green",
                    background: "#b3ded1",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontSize: "20px"
                }}>{message}</p>}

            {/* form for sharing note */}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginBottom: "30px"
                }}>

                {/* email input */}
                <input
                    type="text"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loadingShare}
                    style={{
                        padding: "15px",
                        fontSize: "20px",
                        borderRadius: "10px",
                        border: "none",
                        outline: "none",
                        background: "rgba(255,255,255,0.9)",
                        color: "#333"
                    }} />

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    flexWrap: "wrap"
                }}>

                    {/* share button */}
                    <button
                        type="submit"
                        disabled={loadingShare}
                        style={{
                            background: "#ffffff",
                            color: "#428c44",
                            border: "none",
                            borderRadius: "5px",
                            padding: "15px 30px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}>{loadingShare ? "Sharing" : "Share"}</button>

                    {/* back button */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{
                            background: "#ffffff",
                            color: "#428c44",
                            border: "none",
                            borderRadius: "5px",
                            padding: "15px 30px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}>Back</button>
                </div>
            </form>

            {/* currently shared with title */}
            <h3 style={{
                color: "#ffffff",
                fontSize: "30px",
                textAlign: "center",
                marginBottom: "20px"
            }}>Currently shared with:</h3>

            {/* if note is empty display loading message*/}
            {/* if note is not empty display the users email with remove button */}
            {notes.length === 0 ? (
                <p
                    style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: "20x",
                        padding: "20px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "10px"
                    }}>This notes is not shared with anyone yet</p>

            ) : (

                notes.map((note) => (
                    <div
                        key={note.shared_with_user_id}
                        style={{
                            background: "rgba(255,255,255,0.15)",
                            borderRadius: "15px",
                            padding: "15px 20px",
                            marginBottom: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px"
                        }}>

                        <span style={{
                            color: "#ffffff",
                            fontSize: "20px"
                        }}>
                            {note.email}
                        </span>

                        <button
                            disabled={loadingDelete}
                            onClick={() => handleDelete(note.shared_with_user_id)}
                            style={{
                                background: "#d33131",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "10px 15px",
                                fontSize: "20px",
                                cursor: "pointer"
                            }}>Remove</button>

                    </div>))
            )
            }
        </div>
    )
}

export default Shared