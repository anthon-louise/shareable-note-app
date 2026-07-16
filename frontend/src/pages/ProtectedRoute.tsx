import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Page for checking valid user every route
const ProtectedRoute = ({children} : {children: React.ReactNode}) => {
    const navigate = useNavigate();

    // usestate for loading
    const [checking, setChecking] = useState(true);
    
    useEffect(() => {
        const checkAuth = async () => {
            try {

                // if no user problem then head to the route page
                await api.get("/api/users/me");

            } catch {

                // go back to login if invalid user
                navigate("/login");
            } finally {
                setChecking(false);
            }
        }
        checkAuth();
    }, [])

    // ifapi check is loading display loading message
    if (checking) return <p>Loading...</p>

    // if user is check successfully show the page
    return <>{children}</>
    
}

export default ProtectedRoute;