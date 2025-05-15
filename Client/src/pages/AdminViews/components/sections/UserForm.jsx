import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useAdminData } from "../../../../context/AdminDataContext";



export const UserForm = ({ setIsOpenCreateUpdateModal }) => {
    const { id, modo, getAllUsers } = useAdminData();
    const { enqueueSnackbar } = useSnackbar();
    const [formUser, setFormUser] = useState({
        nombre:"",
        email: "",
        id_rol:"",
        id_cargo:"",
        id_jefe_directo:""
    });


    const [ entidades, setEntidades ] = useState([])

    

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleClick = async() =>{
        try {
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION

            const path = modo === "crear" ? "api/v1/admin/create-user" : `api/v1/admin/update-user/${id}`
            const formData = new FormData()

            formData.append("nombre", formUser.nombre)
            formData.append("email", formUser.email)
            formData.append("id_rol", formUser.id_rol)
            formData.append("id_cargo", formUser.id_cargo)
            formData.append("id_jefe_directo", formUser.id_jefe_directo)
            
            const requestOptions = {
                method: modo === "crear" ? "POST" : "PUT",
                body: formData
            }
            const response = await fetch(`${URL}/${path}`, requestOptions)
            const data = await response.json()
            
            if([200, 201].includes(data.code)){
                getAllUsers()
                enqueueSnackbar(data.message, { variant: "success" });
                setIsOpenCreateUpdateModal(false)
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

        const getEntidades = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION

                const response = await fetch(`${URL}/api/v1/admin/all-entidades`)
                const data = await response.json()
                setEntidades(data.data)
                
            } catch (error) {
                console.log(error);
            }
        }
        getEntidades()

    }, [])

    useEffect(() => {

        const getUserData = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION

                const response = await fetch(`${URL}/api/v1/admin/get-user/${id}`)
                const data = await response.json()
                console.log(data.data);
                setFormUser(data.data)
                
            } catch (error) {
                console.log(error);
            }
        }
        if(modo === "modificar"){
            getUserData()
        }

    }, [])
    

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
                        value={formUser.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Correo Electrónico
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={formUser.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="rol" className="block text-gray-700">
                        Rol
                    </label>
                    <select
                        name="id_rol"
                        value={formUser.id_rol}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        {
                            entidades.roles?.map((rol) =>(
                                <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
                            ))
                        }
                        
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="rol" className="block text-gray-700">
                        Cargo
                    </label>
                    <select
                        name="id_cargo"
                        value={formUser.id_cargo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    >
                        <option value="">Seleccione un Cargo</option>
                        {
                            entidades.cargos?.map((cargo) =>(
                                <option key={cargo.id_cargo} value={cargo.id_cargo}>{cargo.nombre}</option>
                            ))
                        }
                        
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="rol" className="block text-gray-700">
                        Jefe Directo
                    </label>
                    <select
                        name="id_jefe_directo"
                        value={formUser.id_jefe_directo == null ? "" : formUser.id_jefe_directo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                        required
                    >
                        <option value="">Seleccione al Jefe Directo</option>
                        {
                            entidades.usuarios?.map((usuario) =>(
                                <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nombre}</option>
                            ))
                        }
                        
                    </select>
                </div>

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
                            {modo === "crear" ? `Crear Usuario` : `Actualizar Usuario`}
                        </button>
                </div>
            
        </div>
  )
}
