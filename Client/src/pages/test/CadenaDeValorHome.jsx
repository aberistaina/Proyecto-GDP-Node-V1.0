import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";


export const CadenaDeValorHome = () => {
    const [ procesos, setProcesos ] = useState([])
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;

    useEffect(() => {
        const slider = scrollRef.current;

        const mouseDown = (e) => {
            isDown = true;
            slider.classList.add("cursor-grabbing");
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const mouseLeave = () => {
            isDown = false;
            slider.classList.remove("cursor-grabbing");
        };

        const mouseUp = () => {
            isDown = false;
            slider.classList.remove("cursor-grabbing");
        };

        const mouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; // velocidad
            slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener("mousedown", mouseDown);
        slider.addEventListener("mouseleave", mouseLeave);
        slider.addEventListener("mouseup", mouseUp);
        slider.addEventListener("mousemove", mouseMove);

        return () => {
            slider.removeEventListener("mousedown", mouseDown);
            slider.removeEventListener("mouseleave", mouseLeave);
            slider.removeEventListener("mouseup", mouseUp);
            slider.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    useEffect(() => {

        const getAllProcess = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(
                    `${URL}/api/v1/procesos/`, {credentials: "include"}
                );
                const data = await response.json();
                setProcesos(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllProcess();
    }, []);

    const operativos = procesos.filter((p) => p.id_nivel === 1)
    const soporte = procesos.filter((p) => p.id_nivel === 2)
    const estrategicos = procesos.filter((p) => p.id_nivel === 3)

    return (
        <>
            <div
            ref={scrollRef}
            className="overflow-x-auto py-6 px-4 w-full cursor-grab select-none"
        >
            <div className="flex min-w-max">
                <p class="writing-vertical-rl -rotate-90 font-bold ">Procesos Operativos</p>
                {operativos
                    .filter((proceso) => proceso.estado === "activo")
                    .map((proceso, index) => (
                        <div
                            key={proceso.id_proceso}
                            className={`w-80 h-40 bg-[url('/cadena-valor.png')] bg-no-repeat bg-contain bg-center flex items-center justify-center text-black font-bold transition duration-300 ease-in-out transform hover:scale-105 ${index === 0 ? "-ms-28" : ""}`}
                        >
                            <span
                                className="block max-w-[150px] break-words whitespace-normal text-wrap text-center cursor-pointer"
                                onClick={() =>
                                    navigate(
                                        `/process-details/${proceso.id_bpmn}/${proceso.version}`
                                    )
                                }
                            >
                                {proceso.nombre}
                            </span>
                        </div>
                    ))}
            </div>
        </div>

        <div
            
            className="overflow-x-auto py-6 px-4 w-full cursor-grab select-none"
        >
            <div className="flex min-w-max">
                <p class="writing-vertical-rl -rotate-90 font-bold ">Procesos De Soporte</p>
                {soporte
                    .filter((proceso) => proceso.estado === "activo")
                    .map((proceso, index) => (
                        <div
                            key={proceso.id_proceso}
                            className={`w-80 h-40 bg-[url('/cadena-valor.png')] bg-no-repeat bg-contain bg-center flex items-center justify-center text-black font-bold transition duration-300 ease-in-out transform hover:scale-105 ${index === 0 ? "-ms-28" : ""}`}
                        >
                            <span
                                className="block max-w-[150px] break-words whitespace-normal text-wrap text-center cursor-pointer"
                                onClick={() =>
                                    navigate(
                                        `/process-details/${proceso.id_bpmn}/${proceso.version}`
                                    )
                                }
                            >
                                {proceso.nombre}
                            </span>
                        </div>
                    ))}
            </div>
        </div>

        <div
            
            className="overflow-x-auto py-6 px-4 w-full cursor-grab select-none"
        >
            <div className="flex min-w-max">
               {estrategicos.length > 0 ? <p class="writing-vertical-rl -rotate-90 font-bold" >Procesos Estrategicos</p> : null}

                {estrategicos
                    .filter((proceso) => proceso.estado === "activo")
                    .map((proceso, index) => (
                        <div
                            key={proceso.id_proceso}
                            className={`w-80 h-40 bg-[url('/cadena-valor.png')] bg-no-repeat bg-contain bg-center flex items-center justify-center text-black font-bold transition duration-300 ease-in-out transform hover:scale-105 ${index === 0 ? "-ms-28" : ""}`}
                        >
                            <span
                                className="block max-w-[150px] break-words whitespace-normal text-wrap text-center cursor-pointer"
                                onClick={() =>
                                    navigate(
                                        `/process-details/${proceso.id_bpmn}/${proceso.version}`
                                    )
                                }
                            >
                                {proceso.nombre}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
        
        </>
    );
};
