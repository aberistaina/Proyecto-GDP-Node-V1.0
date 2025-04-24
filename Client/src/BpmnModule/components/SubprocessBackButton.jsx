import { useNavigate } from "react-router-dom";


export const SubprocessBackButton = () => {
    const navigate = useNavigate();
    

    const volver = () =>{
        navigate(-1)
        
    }

    return (
        <div className="w-[20%] px-6 mt-4 flex justify-center items-center">
            <button
                onClick={() => volver()}
                className= {`bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition duration-200`}
            >
                Volver
            </button>
        </div>
    );
};
