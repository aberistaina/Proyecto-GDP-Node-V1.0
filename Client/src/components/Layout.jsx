import { useLocation, Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export const Layout = () => {
    const location = useLocation();
    const hideSidebarRoutes = ["/login", "/register", "/recover-password"];
    const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

    return (
        <div>
            {shouldShowSidebar && <NavBar className="z-50"/>}
            <div className="p-6 z-40">
                <Outlet />
            </div>
        </div>
    );
};
