import { useSelector } from "react-redux";

export const HomePage = () => {
    const user = useSelector((state) => state.auth.user);
  return (
    <div>HomePage</div>
  )
}
