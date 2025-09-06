import { useDispatch } from "react-redux";
import {
  addAlimentInMeal,
  changeAlimentInMeal,
  removeAlimentInMeal,
} from "../reducers/weekReducer";

const useAliments = () => {
  const dispatch = useDispatch();
  const create = async (aliment) => {
    await dispatch(addAlimentInMeal(aliment));
  };

  const update = async (aliment) => {
    await dispatch(changeAlimentInMeal(aliment));
  };

  const del = async (aliment) => {
    await dispatch(removeAlimentInMeal(aliment));
  };

  return {
    create,
    update,
    del,
  };
};

export default useAliments;
