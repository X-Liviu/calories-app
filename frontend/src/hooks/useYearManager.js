import { useDispatch } from "react-redux";
import { setYear } from "../redux/reducers/yearReducer";
import { clearWeeks } from "../redux/reducers/weekReducer";

const useYearManager = () => {
  const dispatch = useDispatch();
  const changeYear = (year) => {
    dispatch(clearWeeks()); // Limpieza
    dispatch(setYear(year)); // Cambio de estado
  };

  return { changeYear };
};

export default useYearManager;
