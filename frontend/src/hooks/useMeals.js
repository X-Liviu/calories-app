import { useDispatch } from "react-redux";
import {
  addMealInDay,
  changeMealInDay,
  removeMealInDay,
} from "../reducers/weekReducer";

const useMeals = () => {
  const dispatch = useDispatch();
  const create = async (meal) => {
    await dispatch(addMealInDay(meal));
  };

  const update = async (meal) => {
    await dispatch(changeMealInDay(meal));
  };

  const del = async (day) => {
    await dispatch(removeMealInDay(day));
  };

  return {
    create,
    update,
    del,
  };
};

export default useMeals;
