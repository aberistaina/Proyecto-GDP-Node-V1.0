import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({roles}) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const loading = useSelector((state) => state.auth.loading);
    const user = useSelector((state) => state.auth.user);

    if (loading) return null;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user?.usuario?.id_rol)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;

};
