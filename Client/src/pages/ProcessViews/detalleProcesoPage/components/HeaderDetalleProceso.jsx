import { FaUserLarge } from "react-icons/fa6";
import { FaRegCalendarAlt, FaPaperPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoMdDownload } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { TfiMenuAlt } from "react-icons/tfi";
import { GrDocumentDownload } from "react-icons/gr";
import { RiFolderDownloadLine } from "react-icons/ri";
import { useSnackbar } from "notistack";
import { downloadFile } from "../../../../BpmnModule/utils/downloadFile";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";





export const HeaderDetalleProceso = ({headerProceso, idProceso, setOpenModalVersiones, version}) => {
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate()
    console.log(user.usuario?.id_rol);

    const handleClick = async() =>{
        try {
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
            const response = await fetch(`${URL}/api/v1/procesos/download-process/${idProceso}`)

            if (!response.ok){
                enqueueSnackbar("Hubo un problema al intentar descargar el archivo, intente nuevamente más tarde", { variant: "error" });
            } 

            const nombreArchivo = `${headerProceso.nombre}.bpmn`

            await downloadFile(response, nombreArchivo)
        } catch (error) {
            console.log(error);
        }
    }

    const createOrEditVersion = () =>{
        try {
            navigate(`/new-version/${idProceso}/${version}`)
        } catch (error) {
            console.log(error);
        }
    }

    const solicitarAprobacion = async() =>{
        try {

            const formData = new FormData()

            formData.append("idProceso", idProceso)
            formData.append("version", version)

            const requestOptions = {
                method: "POST",
                body: formData ,

            }
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                ? import.meta.env.VITE_URL_DESARROLLO
                : import.meta.env.VITE_URL_PRODUCCION;

            const response = await fetch(`${URL}/api/v1/procesos/solicitar-aprobacion`, requestOptions)
            const data = await response.json()

            if (data.code === 201) {
                enqueueSnackbar(data.message, { variant: "success" });

            } else {
                enqueueSnackbar(data.message, { variant: "error" });
            }

        } catch (error) {
            console.log(error);
        }
    }

    const aprobarProceso = async() =>{
        try {

            const loggedUser = user.usuario?.id_usuario
            const formData = new FormData()
            formData.append("idProceso", idProceso)
            formData.append("id_usuario", loggedUser)
            formData.append("version", version)
            const requestOptions = {
                method: "POST",
                body: formData ,

            }
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                ? import.meta.env.VITE_URL_DESARROLLO
                : import.meta.env.VITE_URL_PRODUCCION;
            const response = await fetch(`${URL}/api/v1/procesos/solicitar-aprobacion`, requestOptions)
            const data = await response.json()
        } catch (error) {
            console.log(error);
        }
    }

    const rechazarProceso = async() =>{
        try {
            
            const loggedUser = user.usuario?.id_usuario
            const formData = new FormData()
            formData.append("idProceso", idProceso)
            formData.append("id_usuario", loggedUser)
            formData.append("version", version)
            const requestOptions = {
                method: "POST",
                body: formData ,

            }
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                ? import.meta.env.VITE_URL_DESARROLLO
                : import.meta.env.VITE_URL_PRODUCCION;
            const response = await fetch(`${URL}/api/v1/procesos/solicitar-aprobacion`, requestOptions)
            const data = await response.json()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`${headerProceso.estadoVersion == "borrador" ? "bg-yellow-100 "   :"bg-[#ececec]" } rounded-lg drop-shadow-lg py-5 mb-8 flex justify-evenly shadow-[6px_6px_4px_#c0c0c0]`}>
            <div className="flex justify-between w-full mx-auto">

                {/* Lado izquierdo */}
                {/*Agregar etiquetas de Nombre creador y fecha aprovación*/ }
                <div className="w-3/4 pr-4 border-r-2 border-r-[#adadad]">
                    <div className="flex items-center px-8">
                        <IoMdDownload onClick={handleClick} title="Descargar Proceso" className="text-4xl rounded-full bg-[#48752c] p-1 hover:bg-[#294618] cursor-pointer" fill="#ffffff" />
                        <h1 className="text-3xl font-bold px-2">
                            {headerProceso.nombre}
                        </h1>
                    </div>
                    <p className="italic text-md px-[4.8rem] mb-1 text-gray-700">{headerProceso.descripcion}</p>

                    <div className="flex items-center ms-[2.7rem]">
                        <FaUserLarge title="Creador del proceso" />
                        <p className="italic ms-4">{headerProceso.creador}</p>
                    </div>

                    <div className="flex items-center ms-[2.6rem]">
                        <FaRegCalendarAlt title="Fecha de Creación" />
                        <p className="italic ms-4">{headerProceso.fechaCreacion}</p>
                    </div>

                    <div className="flex items-center ms-[2.6rem] ">
                        <GrDocumentDownload title="Documentación" className="text-xl" />
                        <p className="italic ms-4 cursor-pointer hover:text-[#48752c]">Documentación</p>
                    </div>

                    <div className="flex items-center ms-[2.6rem] ">
                        <RiFolderDownloadLine title="Adjuntos" className="text-xl" />
                        <p className="italic ms-4 cursor-pointer hover:text-[#48752c]">Adjuntos</p>
                    </div>
                </div>

                

                {/* Lado derecho */}
                {/*Visualizadores versión, quienes aprobaron (quitar estado actual y detalle avanzado). eliminar fecha de modificación, documentacion y adjuntos*/ }
                <div className="w-[30%] pl-4 flex flex-col">
                    <div className="mb-4">
                        <h1 className="text-2xl ms-5">
                            Detalles
                        </h1>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <MdOutlinePendingActions title="Estado Actual" className="fill-[#b89230] text-xl" />
                        <p className="italic ms-4">{headerProceso.estadoVersion}</p>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <HiUserGroup title="Aprobadores" className="text-xl" />
                        <p className="italic ms-4">{headerProceso.aprobadores && headerProceso.aprobadores.length > 0 ? headerProceso.aprobadores.join(", ") : "No hay aprobadores"}</p>
                    </div>

                    <div className="flex items-center ms-4 px-5">
                        <TfiMenuAlt title="Versiones" className="rotate-180 text-lg" />
                        <p className="italic ms-4 cursor-pointer hover:text-[#48752c]"
                        onClick={(e) =>setOpenModalVersiones(true)}>Versión {headerProceso.version}</p>
                    </div>

                    <div className="flex justify-end ms-4 px-5 gap-2 mt-4">
                        {headerProceso.estadoVersion === "borrador" && [1, 3, 5].includes(user.usuario?.id_rol) && (
                            <button
                            className="bg-[#6f42c1] hover:bg-[#8556d4] text-white text-xs py-2 w-42 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={solicitarAprobacion}
                        >
                            <FaPaperPlane className="me-1" /> Solicitar Aprobación
                        </button>
                        )}

                        {headerProceso.estadoVersion === "enviado" && [1, 2, 5].includes(user.usuario?.id_rol) && (
                            <button
                            className="bg-red-700 hover:bg-red-800 text-white text-xs py-2 w-42 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={rechazarProceso}
                        >
                            <FaTimesCircle className="me-1" /> Rechazar
                        </button>
                        )}

                        {headerProceso.estadoVersion === "enviado" && [1, 2, 5].includes(user.usuario?.id_rol) && (
                            <button
                            className="bg-blue-700 hover:bg-blue-800 text-white text-xs py-2 w-42 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={aprobarProceso}
                        >
                            <FaCheckCircle className="me-1" /> Aprobar
                        </button>
                        )}

                        {[1, 3, 5].includes(user.usuario?.id_rol) && headerProceso.estadoVersion !== "enviado" && <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs py-2 w-42 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={createOrEditVersion}
                        >
                            <CiEdit className="me-1" /> {headerProceso.estadoVersion === "borrador" ? "Editar Borrador" : "Nueva Versión"}
                        </button>}
                    </div>

                    
                </div>
            </div>
        </div>
    );
};
