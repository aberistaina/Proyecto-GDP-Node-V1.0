export const DashboardResumen = ({ borradoresActivos }) => {

    const borradores = borradoresActivos.filter((b) => b.estado === "borrador");
    const borradoresEnEspera = borradoresActivos.filter((b) => b.estado === "enviado");
    const borradoresRechazados = borradoresActivos.filter((b) => b.estado === "rechazado");
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                className={`p-4 rounded-lg text-white bg-yellow-400 shadow-md`}
            >
                <p className="text-sm">Borradores Activos</p>
                <p className="text-2xl font-bold">
                    {borradores.length}
                </p>
            </div>

            <div
                className={`p-4 rounded-lg text-white bg-indigo-500 shadow-md`}
            >
                <p className="text-sm">Borradores En Espera de Aprobación</p>
                <p className="text-2xl font-bold">
                    {borradoresEnEspera.length}
                </p>
            </div>

            <div
                className={`p-4 rounded-lg text-white bg-red-600 shadow-md`}
            >
                <p className="text-sm">Borradores Rechazados</p>
                <p className="text-2xl font-bold">
                    {borradoresRechazados.length}
                </p>
            </div>
        </div>
    );
};
