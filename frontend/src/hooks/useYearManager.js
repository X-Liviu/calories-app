import { useDispatch } from "react-redux";
import { setYear } from "../reducers/yearReducer";
import { clearWeeks } from "../reducers/weekReducer";

const useYearManager = () => {
  const dispatch = useDispatch();
  const changeYear = (year) => {
    dispatch(clearWeeks()); // Limpieza
    dispatch(setYear(year)); // Cambio de estado
  };

  return { changeYear };
};

export default useYearManager;
