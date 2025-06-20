import { useState } from "react";
import { AdminSideBar } from "./components/AdminSideBar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminCards } from "./components/AdminCards";
import { AdminSections } from "./components/AdminSections";
import { CreateUpdateModal } from "./components/CreateUpdateModal";
import { AdminDataProvider } from "../../../context/AdminDataProvider";
import { useSelector } from "react-redux";


export const AdminDashboard = () => {
    
    const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState(false)
    const user = useSelector((state) => state.auth.user);
    const usuario = user?.usuario;

    return (
        <AdminDataProvider>
            <div>
                <AdminHeader usuario={usuario} />
            </div>
            <div className="min-h-screen flex">
                <AdminSideBar usuario={usuario}/>
                <main className="flex-1 p-6 space-y-6">
                    {/* <AdminCards /> */}
                    <AdminSections setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal}  />
                    {isOpenCreateUpdateModal && <CreateUpdateModal setIsOpenCreateUpdateModal ={setIsOpenCreateUpdateModal}/>  }
                </main>
            </div>
        </AdminDataProvider>
    );
};
