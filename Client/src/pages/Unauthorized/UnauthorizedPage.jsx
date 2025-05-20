import { Link } from "react-router-dom";

export const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Acceso Denegado</h1>
                <p className="text-gray-700 text-lg mb-6">
                    No tienes los permisos necesarios para acceder a esta página.
                </p>
                <Link to="/">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                        Volver al inicio
                    </button>
                </Link>
            </div>
        </div>
    );
};
