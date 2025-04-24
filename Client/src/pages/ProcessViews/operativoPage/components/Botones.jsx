
export const Botones = ({ openSubProcesoModal, openFlujoModal }) => {
    return (
        <div className="space-x-4">
            <button className="bg-[#e47575] hover:bg-[#ea8aa5] w-28 rounded-xl py-1 text-white">
                Borrar
            </button>
            <button
                onClick={openSubProcesoModal}
                className="bg-[#00ba8f] hover:bg-[#26c6a3] w-36 rounded-xl py-1 text-white"
            >
                Crear Subproceso
            </button>
            <button
                onClick={openFlujoModal}
                className="bg-[#009eba] hover:bg-[#26acc3] w-36 rounded-xl py-1 text-white"
            >
                Agregar Flujo
            </button>
        </div>
    );
};
