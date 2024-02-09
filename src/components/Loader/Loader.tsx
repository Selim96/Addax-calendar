import { ThreeDots } from "react-loader-spinner";
import s from "./Loader.module.scss";

const Loader:React.FC = () => {
  return (
    <div className={s.loader}>
      <ThreeDots color="#4a56e2" height={100} width={100} />
    </div>
  );
}

export default Loader;