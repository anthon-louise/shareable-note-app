import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProtectedRoute = ({children} : {children: React.ReactNode}) => {
    const navigate = useNavigate();

    const [checking, setChecking] = useState(true);
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/users/me");
            } catch {
                navigate("/login");
            } finally {
                setChecking(false);
            }
        }
        checkAuth();
    }, [])

    if (checking) return <p>Loading...</p>

    return <>{children}</>
    
}

export default ProtectedRoute;