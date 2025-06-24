import { FaChevronRight } from "react-icons/fa";
export const FlechaEntrada = ({texto}) => {
  return (
    <div className="flex items-center flex-col">
        <FaChevronRight className="text-[4rem] text-lime-500 drop-shadow-[1px_1px_0px_green]"/>
        <p className="text-[1rem] text-lime-500 font-bold">{texto}</p>
    </div>
  )
}
