import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuFileSearch } from "react-icons/lu";

export default function Comentarios({
    comentarios,
    getAllComentaries,
    setOpenModalArchivos,
    setIdComentario,
    setMenu
}) {
    const handleClick = (idComentario) => {
        setMenu("comentarios")
        setIdComentario(idComentario);
        setOpenModalArchivos(true);
    };

    useEffect(() => {
        getAllComentaries();
    }, []);

    return (
        <div className="overflow-x-auto max-h-52 bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Comentario</th>
                        <th className="px-4 py-3">Usuario</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {comentarios?.length ? (
                        comentarios &&
                        comentarios.map((comentario) => (
                            <tr
                                key={comentario.id_comentario}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 flex gap-1 items-center min-w-44 max-w-44 ">
                                    <FaRegCalendarAlt />
                                    {comentario.created_at}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                    {comentario.comentario}
                                </td>
                                <td className="px-4 py-2 text-green-700 font-medium min-w-40 max-w-40">
                                    {comentario.nombre_creador}
                                </td>
                                <td className="flex gap-1 items-center">
                                    <LuFileSearch
                                        className="text-xl cursor-pointer"
                                        onClick={() =>
                                            handleClick(
                                                comentario.id_comentario
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">
                                No hay comentarios
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
