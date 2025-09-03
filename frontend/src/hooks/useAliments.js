import { useDispatch } from "react-redux";
import { addAlimentInMeal, removeAlimentInMeal } from "../reducers/weekReducer";

const useAliments = () => {
  const dispatch = useDispatch();
  const create = async (aliment) => {
    await dispatch(addAlimentInMeal(aliment));
  };

  const del = async (aliment) => {
    await dispatch(removeAlimentInMeal(aliment));
  };

  return {
    create,
    del,
  };
};

export default useAliments;
