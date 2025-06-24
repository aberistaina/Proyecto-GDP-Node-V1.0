import { FaChevronRight } from "react-icons/fa";

export const FlechasIntermedias = ({ rotacion }) => {
    return (
        <div className="flex items-center flex-col">
            <FaChevronRight
                className={`text-[2.7rem] text-lime-500 drop-shadow-[1px_1px_0px_green] opacity-50 ${rotacion} `}
            />
        </div>
    );
};
