import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuFileSearch } from "react-icons/lu";

export const Oportunidades = ({
    getAllOpportunities,
    oportunidades,
    setOpenModalArchivos,
    setIdComentario,
    setMenu
}) => {
    useEffect(() => {
        getAllOpportunities();
    }, []);

    const handleClick = (idComentario) => {
        setMenu("oportunidades")
        setIdComentario(idComentario);
        setOpenModalArchivos(true);
    };

    return (
        <div className="overflow-x-auto max-h-52 bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Asunto</th>
                        <th className="px-4 py-3">Descripción</th>
                        <th className="px-4 py-3">Usuario</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {oportunidades?.length ? (
                        oportunidades.map((oportunidad) => (
                            <tr
                                key={oportunidad.id_oportunidad}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 flex gap-1 justify-center min-w-44 max-w-44">
                                    <FaRegCalendarAlt />{" "}
                                    {oportunidad.created_at}
                                </td>
                                <td className="px-4 py-2 font-medium text-gray-900">
                                    {oportunidad.asunto}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                    {oportunidad.descripcion}
                                </td>
                                <td className="px-4 py-2 text-green-700 font-medium min-w-40 max-w-40">
                                    {oportunidad.nombre_creador}
                                </td>
                                <td className="flex gap-1 items-center">
                                    <LuFileSearch
                                        className="text-xl cursor-pointer"
                                        onClick={() =>
                                            handleClick(
                                                oportunidad.id_oportunidad
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">
                                No hay oportunidades
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
