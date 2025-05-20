export const DashboardResumen = ({ procesosPendientes }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                className={`p-4 rounded-lg text-white bg-yellow-400 shadow-md`}
            >
                <p className="text-sm">Pendientes por aprobar</p>
                <p className="text-2xl font-bold">
                    {procesosPendientes.length}
                </p>
            </div>

            <div
                className={`p-4 rounded-lg text-white bg-indigo-500 shadow-md`}
            >
                <p className="text-sm">Procesos aprobados</p>
                <p className="text-2xl font-bold">
                    {procesosPendientes.length}
                </p>
            </div>

            <div
                className={`p-4 rounded-lg text-white bg-red-600 shadow-md`}
            >
                <p className="text-sm">Procesos Rechazados</p>
                <p className="text-2xl font-bold">
                    {procesosPendientes.length}
                </p>
            </div>
        </div>
    );
};
