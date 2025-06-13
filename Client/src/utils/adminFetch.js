export const getAllUsers = async (URL, setUsuarios) => {
        try {
            const response = await fetch(`${URL}/api/v1/admin/all-users`, {
            credentials: "include",
        });
            const data = await response.json();
            setUsuarios(data.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

export const getAllRoles = async (URL, setRoles) => {
        try {
            const response = await fetch(`${URL}/api/v1/admin/all-roles`, {
            credentials: "include",
        });
            const data = await response.json();
            setRoles(data.data);
        } catch (error) {
            console.error("Error al obtener roles:", error);
        }
    };

export const getAllCargos = async (URL, setCargos) => {
        try {
            const response = await fetch(`${URL}/api/v1/admin/all-cargos`, {
            credentials: "include",
        });
            const data = await response.json();
            setCargos(data.data);
        } catch (error) {
            console.error("Error al obtener cargos:", error);
        }
    };

export const getAllNiveles = async (URL, setNiveles) => {
        try {
            const response = await fetch(`${URL}/api/v1/admin/all-niveles`, {
            credentials: "include",
        });
            const data = await response.json();
            setNiveles(data.data);
        } catch (error) {
            console.error("Error al obtener niveles:", error);
        }
    };

export const handleUpdateClick = (setModo, setIsOpenCreateUpdateModal, id, setID) =>{
        try {
            setModo("modificar")
            setID(id)
            setIsOpenCreateUpdateModal(true)
            
        } catch (error) {
            console.log(error);
        }
    }

export const handleCreateClick = (setModo, setIsOpenCreateUpdateModal) =>{
        try {
            setModo("crear")
            setIsOpenCreateUpdateModal(true)
        } catch (error) {
            console.log(error);
        }
    }

export const handleDeleteClick = async(id, enqueueSnackbar, type, getAllData, confirm) => {
        try {
            const elementoAEliminar = type === "usuario" ? "a este Usuario" : `este ${type.charAt(0).toUpperCase()}${type.slice(1)}`;
            const confirmacion = await confirm(
                    `¿Está Seguro que desea eliminar ${elementoAEliminar}?`,
                    {
                        title: "Alerta",
                        confirmText: "Sí",
                        cancelText: "No",
                    }
                );
            const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
            if(!confirmacion){
                return
            }

            let path = ""

            switch (type) {
                    case "cargo":
                        path = `api/v1/admin/delete-cargo/${id}`;
                        break;
                    case "nivel":
                        path = `api/v1/admin/delete-nivel/${id}`;
                        break;
                    case "rol":
                        path = `api/v1/admin/delete-rol/${id}`;
                        break;
                    default:
                        console.error("Tipo no válido:", type);
                        return;
            }
            const response = await fetch(`${URL}/${path}`, {method: "DELETE" }, {
            credentials: "include",
        })
            const data = await response.json()
            
            if(data.code == 200){
                enqueueSnackbar(data.message, { variant: "success" });
                getAllData()
            }else{
                enqueueSnackbar(data.message, { variant: "error" });
            }
        } catch (error) {
            console.log(error);
        }
    } 



export const getEntidadesData = async(id, setFormEntidades, type ) =>{
    try {
        const URL =
        import.meta.env.VITE_APP_MODE === "desarrollo"
            ? import.meta.env.VITE_URL_DESARROLLO
            : import.meta.env.VITE_URL_PRODUCCION

        let path = ""

        switch (type) {
                case "cargo":
                    path = `api/v1/admin/get-cargo/${id}`;
                    break;
                case "nivel":
                    path = `api/v1/admin/get-nivel/${id}`;
                    break;
                case "rol":
                    path = `api/v1/admin/get-rol/${id}`;
                    break;
                default:
                    console.error("Tipo no válido:", type);
                    return;
        }

        const response = await fetch(`${URL}/${path}`, {
            credentials: "include",
        })
        const data = await response.json()
        setFormEntidades(data.data)
        
    } catch (error) {
        console.log(error);
    }
}