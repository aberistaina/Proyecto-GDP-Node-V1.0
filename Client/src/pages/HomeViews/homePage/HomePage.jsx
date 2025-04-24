import { Bpmn } from "../../../components/Bpnm";
import { useSelector } from "react-redux";

export const HomePage = () => {
    const user = useSelector((state) => state.auth.user);
    return (
        <div className="flex-1 flex justify-center items-center p-6">
            { <Bpmn />}
        </div>
    );
};
