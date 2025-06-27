import { useEffect, useState } from "react";
import { CadenaDeValorEstrategicos } from "./components/CadenaDeValorEstrategicos";
import { CadenaDeValorSoporte } from "./components/CadenaDeValorSoporte";
import { CadenaDeValorOperativos } from "./components/CadenaDeValorOperativos";
import { FlechaEntrada } from "./components/FlechaEntrada";
import { FlechasIntermedias } from "./components/FlechasIntermedias";

export const CadenaDeValorPage = () => {
    
    const [ procesos, setProcesos ] = useState([])

    useEffect(() => {
        const getAllProcess = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/get-all`, {
                    credentials: "include",
                });
                const data = await response.json();
                console.log("CADENA",data.data);
                setProcesos(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllProcess();
    }, []);

    const estrategicos = procesos.filter((p) => p.id_nivel === 1 && p.macroproceso);
    const operativos = procesos.filter((p) => p.id_nivel === 2 && p.macroproceso);
    const soporte = procesos.filter((p) => p.id_nivel === 3 && p.macroproceso);
    
    return (

        <div className="flex items-center">
            <div className="w-[5%]">
                <FlechaEntrada texto="Entradas" />
            </div>
            <div>
            </div>
            <div className="w-[90%]">
                <CadenaDeValorEstrategicos estrategicos={estrategicos} />
                <FlechasIntermedias rotacion="rotate-90" />
                <CadenaDeValorOperativos operativos={operativos} />
                <FlechasIntermedias rotacion="-rotate-90" />
                <CadenaDeValorSoporte soporte={soporte} />
            </div>
            <div className="w-[5%]">
                <FlechaEntrada texto="Salidas" />
            </div>
        </div>

    )
};
