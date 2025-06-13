import { TablaBitacoraComentarios } from "../detalleProcesoPage/components/TablaBitacoraComentarios";
import { BotonNuevoComentarioBitacora } from "./components/BotonNuevoComentarioBitacora";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalBitacoraComentarios from "./components/ModalBitacoraComentarios";

export const BitacoraProcesoPage = () => {

    const user = useSelector((state) => state.auth.user);
    const { version } = useParams();
    const [openModalBitacora, setOpenModalBitacora] = useState(false)
    const [comentarios, setComentarios ] = useState([])

    const getAllComentaries = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/comentarios/get-bitacora-aprobaciones/${version}`, {credentials: "include"})
                const data = await response.json()
                setComentarios(data.data)
            } catch (error) {
                console.log(error);
            }
    }

    useEffect(() => {
        const fetchComentarios = async () => {
            await getAllComentaries()
        };
        fetchComentarios();
    }, [version]);

    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 px-5 my-8 shadow-[6px_6px_4px_#c0c0c0]">
            <div className="flex justify-end pb-4">
                <BotonNuevoComentarioBitacora setOpenModalBitacora={setOpenModalBitacora} />
            </div>
            <TablaBitacoraComentarios comentarios={comentarios} />
            {openModalBitacora && 
                <ModalBitacoraComentarios />
            }
        </div>
    );
};
