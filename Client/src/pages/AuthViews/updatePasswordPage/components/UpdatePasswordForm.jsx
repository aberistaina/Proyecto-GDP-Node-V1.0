import { useState} from "react";
import { fetchHook } from "../../../../hooks/fetchHook";
import { useNavigate, Link } from "react-router-dom"; 
import PulseLoader from "react-spinners/PulseLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { validarPassword } from "../../../../utils/validators";


export const UpdatePasswordForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [formUpdatePassword, setFormUpdatePassword] = useState({
        password: "",
        repeatPassword: ""
    });

    //Usestate para mostrar u ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    
    //Usestate para gestionar errores al ingresar datos en los inputs
    const [error, setError] = useState({
        passwordFormat: false,
        equalPassword: false,
    });

    //Estado de login para el boton de carga
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormUpdatePassword({ ...formUpdatePassword, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            
            if (formUpdatePassword.password !== formUpdatePassword.repeatPassword) {
                setError({ equalPassword: true });
                return;
            }else{
                setError({ equalPassword: false });
            }
            
            if (!validarPassword(formUpdatePassword.password)) {
                setError({ passwordFormat: true });
                return;
            }else{
                setError({ passwordFormat: false })
            }
            
            
        
            setIsLoading(true);

            const data = await fetchHook("http://localhost:3000/api/v1/auth/", "POST", formUpdatePassword);
            if (data.token) {
                localStorage.setItem("token", data.token);
                enqueueSnackbar("Sesión iniciada correctamente", { variant: "success" });
                navigate("/"); 
            } else {
                setError({ ...error, invalidCredentials: true });
                console.error("Error en el login:", data.message);
                enqueueSnackbar("Error al iniciar sesión", { variant: "error" });
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>               
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700">
                        Contraseña
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formUpdatePassword.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            required
                        />
                        {showPassword ? (
                            <FaEyeSlash
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        ) : (
                            <FaEye
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        )}
                    </div>
                </div>
                {error.passwordFormat && <span className="text-red-600 font-semibold text-sm">La contraseña debe tener al menos 9 caracteres: 4 letras, 4 números, 1 caracter especial y al menos una mayúscula y una minúscula</span>}

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700">
                        Repite tu Contraseña
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            name="repeatPassword"
                            value={formUpdatePassword.repeatPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            required
                        />
                        {showRepeatPassword ? (
                            <FaEyeSlash
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            />
                        ) : (
                            <FaEye
                                className="text-gray-500 text-xl cursor-pointer"
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            />
                        )}
                    </div>
                </div>
                {error.equalPassword && <span className="text-red-600 font-semibold text-sm">Las contraseñas no coinciden</span>}

                <button
                    type="submit"
                    className="w-full bg-[#10644C] hover:bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Modificar Contraseña"
                    )}
                </button>
            </form>
        </div>
    );
};



