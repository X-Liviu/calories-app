import { useDispatch } from "react-redux";
import { addAlimentInMeal, removeAlimentInMeal } from "../reducers/weekReducer";

const useAliments = () => {
  const dispatch = useDispatch();
  const create = async (day) => {
    await dispatch(addAlimentInMeal(day));
  };

  const del = async (day) => {
    await dispatch(removeAlimentInMeal(day));
  };

  return {
    create,
    del,
  };
};

export default useAliments;
