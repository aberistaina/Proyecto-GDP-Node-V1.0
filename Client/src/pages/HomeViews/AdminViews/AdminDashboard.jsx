import { useState } from "react";
import { AdminSideBar } from "./components/AdminSideBar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminSections } from "./components/AdminSections";
import { CreateUpdateModal } from "./components/CreateUpdateModal";
import { AdminDataProvider } from "../../../context/AdminDataProvider";
import { useSelector } from "react-redux";
import { ModalUpdateProcess } from "./components/ModalUpdateProcess";
import { ModalUpdateVersion } from "./components/ModalUpdateVersion";


export const AdminDashboard = () => {
    
    const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState(false)
    const [openModalProcess, setOpenModalProcess] = useState(false)
    const [openModalVersion, setOpenModalVersion] = useState(false)
    const [ versiones, setVersiones ] = useState([])
    const [ modo, setModo ] = useState("proceso")
    const user = useSelector((state) => state.auth.user);
    const usuario = user?.usuario;

    const getVersions = async(id, setVersiones) =>{
                try {
                    const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION
                
                    const requestOptions = {
                        credentials: "include",
                    }
    
                    const response = await fetch(`${URL}/api/v1/admin/get-versions/${id}`, requestOptions )
                    const data = await response.json()
                    setVersiones(data.data)
                } catch (error) {
                    console.log(error);
                }
    }

    return (
        <AdminDataProvider>
            <div>
                <AdminHeader usuario={usuario} />
            </div>
            <div className="min-h-screen flex">
                <div className="w-[15%]">
                    <AdminSideBar usuario={usuario} setModo={setModo}/>
                </div>
                <main className="flex-1 p-6 space-y-6 w-[85%] justify-center ">
                    {/* <AdminCards /> */}
                    <AdminSections setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} setOpenModalProcess={setOpenModalProcess} setOpenModalVersion={setOpenModalVersion} modo={modo} setModo={setModo} getVersions={getVersions} setVersiones={setVersiones} versiones={versiones} />
                    {isOpenCreateUpdateModal && <CreateUpdateModal setIsOpenCreateUpdateModal ={setIsOpenCreateUpdateModal}/>  }
                    {openModalProcess && <ModalUpdateProcess setOpenModalProcess ={setOpenModalProcess}/>  }
                    {openModalVersion && <ModalUpdateVersion setOpenModalVersion ={setOpenModalVersion} getVersions={getVersions} setVersiones={setVersiones}/>  }
                </main>
            </div>
        </AdminDataProvider>
    );
};
