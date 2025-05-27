import { useNavigate } from "react-router-dom";

export const CadenaValor = ({ allProcess }) => {
    const navigate = useNavigate();
    return (
        <div className="overflow-x-auto py-6 px-4 w-full">
            <div className="flex gap-20 min-w-max">
                {allProcess.filter((proceso) => proceso.estado === "activo").map((proceso) => (
                    <button
                        key={proceso.id_proceso}
                        className="relative inline-block drop-shadow-lg bg-[#8DA4FF] text-white border  min-h-[109px] py-[18px] px-[18px] rounded-lg text-md text-center font-bold
                        before:content-[''] before:absolute before:z-0 before:bg-[#8DA4FF] before:border-indigo-800 before:w-[81px] before:h-[81px] before:transform before:rotate-45 before:top-[13px] before:right-[-35px] before:origin-[50%] before:rounded-lg hover:cursor-pointer hover:bg-indigo-500 before:hover:bg-indigo-500"
                        onClick={() => navigate(`/process-details/${proceso.id_bpmn}/${proceso.version}`)}
                    >
                        <span className="block max-w-[240px] break-words whitespace-normal text-wrap pr-10 -z-50 ">
                            {proceso.nombre}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
