import { useState } from "react";
import { MdEmail } from "react-icons/md";
import PulseLoader from "react-spinners/PulseLoader";
import { formatTime } from "../../../../utils/formatTime";
import { useSnackbar } from "notistack";
import { fetchHook } from "../../../../hooks/fetchHook";

export const EmailForm = ({ handleEmailSent, saveTimeNow, timeLeft }) => {
    const { enqueueSnackbar } = useSnackbar()
    const [formUser, setFormUser] = useState({
        email: localStorage.getItem("email") || "",
    });

    //Estado de login para el boton de carga
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            localStorage.setItem("email", formUser.email);
            saveTimeNow();
            setIsLoading(true);
            handleEmailSent();
            const body = {
                email: formUser.email,
            }

            const data = await fetchHook("http://localhost:3000/api/v1/auth/recover-password", "POST", body);

            if(data.code === 200){
                enqueueSnackbar("Correo enviado. Sigue las instrucciones para restablecer tu contraseña", { variant: "success" });
            }else{
                enqueueSnackbar("Hubo un error interno del servidor", { variant: "error" });
                setIsLoading(false)
            }
            
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">
                Restablecer contraseña
            </h2>
            <h4 className=" mb-4 text-center">
                Introduce tu correo electronico y te enviaremos un código para
                que puedas restablecer tu contraseña
            </h4>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Correo Electrónico
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formUser.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            required
                        />
                        <MdEmail className="text-gray-500 text-xl" />
                    </div>
                </div>
                {/* Mensaje de caducidad */}
                <div className="text-sm text-gray-500 text-center mb-4">
                    {timeLeft !== null && timeLeft > 0 ? (
                        <>
                            Podrás pedir un nuevo código dentro de:{" "}
                            <strong>{formatTime(timeLeft)}</strong>
                        </>
                    ) : null}
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#10644C] hover:bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center"
                    disabled={isLoading || timeLeft > 0}
                >
                    {isLoading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Enviar código"
                    )}
                </button>
            </form>
        </div>
    );
};
