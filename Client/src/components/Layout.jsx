import { useLocation, Outlet, useParams } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export const Layout = () => {
    const location = useLocation();
    const hideSidebarRoutes = ["/login", "/register", "/recover-password"];
    const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

    const isVistaConBpmn = () => {
        return location.pathname.includes("process-details");
    };

    return (
        <>
            {shouldShowSidebar && <NavBar />}

            <div className="bg-[#EFF0F2] min-h-screen px-[16rem] pt-6 pb-10">
                <Outlet />
            </div>

            {isVistaConBpmn() ? (
                <div className="w-full bg-[#EFF0F2] pt-[36rem]">
                    <Footer />
                </div>
            ) : (
                <div className="w-full bg-[#EFF0F2]">
                    <Footer />
                </div>
            )}
        </>
    );
};
