import { useState} from "react";
import { useNavigate, Link } from "react-router-dom"; 
import PulseLoader from "react-spinners/PulseLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { validarEmail } from "../../../../utils/validators";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { fetchUsuario } from "../../../../store/authThunks";


export const LoginForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [formUser, setFormUser] = useState({
        email: "",
        password: ""
    });

    //Usestate para mostrar u ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    
    //Usestate para gestionar errores al ingresar datos en los inputs
    const [error, setError] = useState({
        emailFormat: false,
        invalidCredentials: false,
    });

    //Estado de login para el boton de carga
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const loginUser = async (e) => {
        try {
            e.preventDefault();
            
            if (!validarEmail(formUser.email)) {
                setError({ email: true });
                return;
            } else {
                setError({ email: false });
            }
        
            setIsLoading(true);

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                credentials: "include",
                body: JSON.stringify(formUser),
                

            }
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;

            const response = await fetch(`${URL}/api/v1/auth/login`, requestOptions)
            const data = await response.json()

            if (data.code === 200) {
                enqueueSnackbar("Sesión iniciada correctamente", { variant: "success" });
                dispatch(fetchUsuario());
                navigate("/"); 
            } else {
                setError({ ...error, invalidCredentials: true });
                enqueueSnackbar(data.message, { variant: "error" });
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
            <form onSubmit={loginUser}>
                <div className="mb-4 ">
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
                        required/>
                        <MdEmail className="text-gray-500 text-xl" />
                    </div>
                    
                    {error.email && <span className="text-red-600 font-semibold text-sm">Ingresa un correo electrónico válido</span>}
                    {error.invalidCredentials && <span className="text-red-600 font-semibold">Correo o contraseña incorrectos</span>}
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700">
                        Contraseña
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formUser.password}
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
                <button
                    type="submit"
                    className="w-full bg-[#10644C] hover:bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
            </form>
            <div className="mt-4 text-center">
                {/* <p className="text-gray-600">
                    ¿No tienes cuenta?
                    <a href="/register" className="text-teal-500 hover:text-[#10644C]"> Crear una</a>
                </p> */}
                <p className="text-gray-600">
                    ¿Has perdido tu contraseña? 
                    <Link to="/recover-password" 
                        className={`text-teal-500 hover:text-[#10644C] ms-1 ${isLoading ? "pointer-events-none text-gray-400" : ""}`}> 
                        Recuperar contraseña
                        </Link>
                </p>
            </div>
        </div>
    );
};



