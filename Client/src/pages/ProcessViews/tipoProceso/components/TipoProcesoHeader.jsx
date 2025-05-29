import { CadenaValor } from "./CadenaValor";
export const TipoProcesoHeader = ({ titulo, allProcess }) => {
    return (
        <div className="bg-gradient-to-r from-[#FAF0FF] to-[#F3FAFF] shadow-lg rounded-2xl pt-4 mb-8">
            <div>
                <h1 className="text-4xl px-8 mb-6">{titulo}</h1>
                
            </div>
            <div>
                <CadenaValor allProcess={allProcess}  />
            </div>
        </div>
    );
};
