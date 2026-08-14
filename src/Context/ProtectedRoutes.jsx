import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated, business, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (business?.registrationStatus !== "COMPLETED") {
        return <Navigate to="/create-business" replace />;
    }

    return <Outlet />;
}