import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useAdminData } from "../../../../context/AdminDataContext";
import { getEntidadesData } from "../../../../utils/adminFetch";


export const EntidadesForm = ({ setIsOpenCreateUpdateModal }) => {
    const { getAllRoles, getAllNiveles, getAllCargos } = useAdminData();
    const { id, modo, type } = useAdminData();
    const { enqueueSnackbar } = useSnackbar();
    const [formEnditades, setFormEntidades] = useState({
        nombre:"",
        descripcion:""
    });


    const handleChange = (e) => {
        setFormEntidades({ ...formEnditades, [e.target.name]: e.target.value });
    };

    const handleClick = async() =>{
        try {
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION

            const formData = new FormData()
            formData.append("nombre", formEnditades.nombre)
            if (formEnditades.descripcion) formData.append("descripcion", formEnditades.descripcion);

            let path = ""

            switch (type) {
                case "cargo":
                    path = modo === "crear"
                        ? "api/v1/admin/create-cargo"
                        : `api/v1/admin/update-cargo/${id}`;
                    break;
                case "nivel":
                    path = modo === "crear"
                        ? "api/v1/admin/create-nivel"
                        : `api/v1/admin/update-nivel/${id}`;
                    break;
                case "rol":
                    path = modo === "crear"
                        ? "api/v1/admin/create-rol"
                        : `api/v1/admin/update-rol/${id}`;
                    break;
                default:
                    console.error("Tipo no válido:", type);
                    return;
        }

            const requestOptions = {
                method: modo === "crear" ? "POST" : "PUT",
                body: formData,
            };

            const response = await fetch(`${URL}/${path}`, requestOptions)
            const data = await response.json()

            

            if([200, 201].includes(data.code)){
                enqueueSnackbar(data.message, { variant: "success" });
                setIsOpenCreateUpdateModal(false)

                if(type === "cargo"){
                    getAllCargos()
                }else if(type === "rol"){
                    getAllRoles()
                }else{
                    getAllNiveles()
                }
            }else if(data.code ===400 ){
                enqueueSnackbar(data.message, { variant: "warning" });
            }else{
                enqueueSnackbar(data.message, { variant: "error" });
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getUpdateData = async() => {
            if(modo === "modificar"){
            await getEntidadesData(id, setFormEntidades, type)
        }}
        getUpdateData()
    }, [type])
    

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <form>
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-gray-700">
                        Nombre
                    </label>
                    <input
                        name="nombre"
                        type="text"
                        value={formEnditades.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>
                { type === "cargo" &&
                    <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Descripcion
                    </label>
                    <input
                        name="descripcion"
                        type="text"
                        value={formEnditades.descripcion}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>
                }
            </form>
            <div className="flex justify-center space-x-4">
                        <button
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            onClick={() => setIsOpenCreateUpdateModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleClick}
                        >
                            {modo === "crear" ? `Crear ${type}` : `Actualizar ${type}`}
                        </button>
                </div>
            
        </div>
  )
}
