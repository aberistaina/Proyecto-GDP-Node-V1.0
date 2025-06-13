import { useEffect, useState } from "react";

export const AdminCards = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        const getAllNiveles = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/admin/cards-data`, {credentials: "include"});
                const data = await response.json();
                setData(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllNiveles();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                    className={`bg-yellow-400 text-white rounded-lg shadow-md p-4`}
                >
                    <p className="text-sm font-medium">Usuarios</p>
                    <p className="text-2xl font-bold">{data.usuarios}</p>
                </div>

                <div
                    className={`bg-indigo-500 text-white rounded-lg shadow-md p-4`}
                >
                    <p className="text-sm font-medium">Roles</p>
                    <p className="text-2xl font-bold">{data.roles}</p>
                </div>

                <div
                    className={`bg-pink-500 text-white rounded-lg shadow-md p-4`}
                >
                    <p className="text-sm font-medium">Cargos</p>
                    <p className="text-2xl font-bold">{data.cargos}</p>
                </div>

                <div
                    className={`bg-green-500 text-white rounded-lg shadow-md p-4`}
                >
                    <p className="text-sm font-medium">Niveles</p>
                    <p className="text-2xl font-bold">{data.niveles}</p>
                </div>
        </div>
    );
};
