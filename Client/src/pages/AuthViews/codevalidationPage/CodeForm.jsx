import { useState , useEffect} from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { formatTime } from "../../../utils/formatTime";


export const CodeForm = ({ handleCodeVerified, timeLeft}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [formCode, setFormCode] = useState({
        code: ""
    })

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            handleCodeVerified()
            setIsLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">
                Restablecer contraseña
            </h2>
            <h4 className=" mb-4 text-center">
                Ingresa el código de 6 dígitos que enviamos a tu correo electrónico
            </h4>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Código
                    </label>
                        <input
                            type="text"
                            name="codigo"
                            id="codigo"
                            value={formCode.code}
                            onChange={(e) => setFormCode({code: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            required
                        />
                </div>

                <div className="text-sm text-gray-500 text-center mb-4">
                    <span className="text-red-500">¿No has recibido ningún código?</span> 
                    <span onClick={() => handleCodeVerified(1)} className="text-teal-500 hover:text-[#10644C] ms-1 cursor-pointer">Reenviar código</span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#10644C] hover:bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Restablecer"
                    )}
                </button>
            </form>
        </div>
    );
};
