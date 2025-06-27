import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

export const CadenaDeValorSoporte = ({ soporte }) => {
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
            const walk = (x - startX) * 1.5;
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
    return (
        <div ref={scrollRef} className="flex items-center overflow-x-auto py-6 px-4 w-full cursor-grab select-none">
            <div className="w-[50px] flex justify-center">
                <p className="-rotate-90 font-bold whitespace-nowrap">
                    Procesos De Soporte
                </p>
            </div>

            <div>
                <div className="flex min-w-full bg-[#67AA39] min-h-40 rounded-md py-2 items-center">
                    {soporte
                        .filter((proceso) => proceso.estado === "activo")
                        .map((proceso, index) => (
                            <div
                                key={proceso.id_proceso}
                                className="w-60 h-20 bg-[#F0F0F0] bg-no-repeat bg-contain bg-center flex items-center justify-center text-black font-bold transition duration-300 ease-in-out transform hover:scale-105 ms-4 rounded-md"
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
        </div>
    );
};
