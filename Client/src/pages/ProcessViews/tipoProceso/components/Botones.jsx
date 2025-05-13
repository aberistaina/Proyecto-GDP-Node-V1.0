
export const Botones = ({ openProcessModal }) => {
    return (
        <div className="space-x-4">
            <button
                onClick={openProcessModal}
                className="bg-[#00ba8f] hover:bg-[#26c6a3] w-36 rounded-xl py-1 text-white"
            >
                Crear Poceso
            </button>
            <button className="bg-[#e47575] hover:bg-[#ea8aa5] w-28 rounded-xl py-1 text-white">
                Borrar
            </button>
        </div>
    );
};
