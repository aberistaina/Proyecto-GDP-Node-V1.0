import { useLocation, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
    const location = useLocation();
    const hideSidebarRoutes = ["/login", "/register", "/recover-password"];
    const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

    return (
        <div className="flex h-screen">
            {shouldShowSidebar && <Sidebar />}
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
};
