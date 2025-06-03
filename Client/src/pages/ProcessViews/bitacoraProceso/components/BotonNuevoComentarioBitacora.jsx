import { useState } from "react";
import { GoPlus } from "react-icons/go";


export const BotonNuevoComentarioBitacora = ({ setOpenModal }) => {

  return (
    <>
        <button className="bg-[#16A34A] hover:bg-[#1f8044] w-48 rounded-md py-1 text-white flex justify-center items-center gap-1"
        onClick={() => setOpenModal(true)}
        >
            <GoPlus className="text-xl mt-1k,"/> Agregar Comentario
        </button>

        
    </>
  )
}
