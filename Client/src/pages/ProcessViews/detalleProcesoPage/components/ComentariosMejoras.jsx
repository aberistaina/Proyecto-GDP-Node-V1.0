import { ButtonMejorasComentarios } from "./ButtonMejorasComentarios";
import Comentarios from "./Comentarios";
import { Oportunidades } from "./Oportunidades";
import { TablaBitacoraComentarios } from "./TablaBitacoraComentarios";
import { useSelector } from "react-redux";

export const ComentariosMejoras = ({idProceso, setOpenModal, tabActiva, setTabActiva, version, comentarios, oportunidades, getAllComentaries, getAllOpportunities, comentarioBitacora, getComentariosBitacora, setOpenModalArchivos, setIdComentario}) => {
    
    const user = useSelector((state) => state.auth.user);
    const roles = [1, 2, 3, 5]
  

  return (
    <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 px-5 my-8 shadow-[6px_6px_4px_#c0c0c0]">
      {/* Pestañas */}
      <div className="flex border-b border-gray-300 mb-4 justify-between">
        <div>
            <button
            className={`px-4 py-2 font-semibold ${
                tabActiva === "oportunidades"
                ? "border-b-4 border-green-500 text-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setTabActiva("oportunidades")}
            >
            Oportunidades
            </button>
            <button
            className={`px-4 py-2 font-semibold ${
                tabActiva === "comentarios"
                ? "border-b-4 border-green-500 text-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setTabActiva("comentarios")}
            >
            Comentarios
            </button>

            { roles.includes(user?.usuario?.id_rol) &&
                <button
            className={`px-4 py-2 font-semibold ${
                tabActiva === "bitacora"
                ? "border-b-4 border-green-500 text-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setTabActiva("bitacora")}
            >
            Bitácora
            </button>
            }
        </div>
        <div>
        {tabActiva === "oportunidades" || tabActiva === "comentarios" ||  tabActiva === "bitacora"
        ? 
        <ButtonMejorasComentarios menu={tabActiva} idProceso={idProceso} setOpenModal={setOpenModal} />
        :
        null
            }
        </div>
    </div>

      {/* Contenido condicional */}
      {tabActiva === "oportunidades" && (
        <div>
          {/* Oportunidades */}
          <Oportunidades idProceso={idProceso} version={version} oportunidades={oportunidades} getAllOpportunities={getAllOpportunities} setOpenModalArchivos={setOpenModalArchivos} setIdComentario={setIdComentario} />
        </div>
      )}

      {tabActiva === "comentarios" && (
        <div>
          {/* Comentarios */}
            <Comentarios idProceso={idProceso} version={version} comentarios={comentarios} getAllComentaries={getAllComentaries} setOpenModalArchivos={setOpenModalArchivos} setIdComentario={setIdComentario} />
        </div>
      )}

      {tabActiva === "bitacora" && (
        <div>
          {/* Bitacora */}
            <TablaBitacoraComentarios version={version} comentarioBitacora={comentarioBitacora} getComentariosBitacora={getComentariosBitacora} />
        </div>
      )}
    </div>
  );
};
