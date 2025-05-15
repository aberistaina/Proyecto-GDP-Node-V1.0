import { useState } from "react";
import { AdminSideBar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminCards } from "./components/AdminCards";
import { AdminSections } from "./components/AdminSections";
import { CreateUpdateModal } from "./components/CreateUpdateModal";
import { AdminDataProvider } from "../../context/AdminDataProvider";


export const AdminDashboard = () => {
    const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState(false)

    return (
        <AdminDataProvider>
            <div className="min-h-screen flex bg-gray-100">
                <AdminSideBar/>
                <main className="flex-1 p-6 space-y-6">
                    <AdminHeader />
                    {/* <AdminCards /> */}
                    <AdminSections setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal}  />
                    {isOpenCreateUpdateModal && <CreateUpdateModal setIsOpenCreateUpdateModal ={setIsOpenCreateUpdateModal}/> }
                </main>
            </div>
        </AdminDataProvider>
    );
};
