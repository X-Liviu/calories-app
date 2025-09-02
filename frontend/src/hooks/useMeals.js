import { useDispatch } from "react-redux";
import { addMealInDay, removeMealInDay } from "../reducers/weekReducer";

const useMeals = () => {
  const dispatch = useDispatch();
  const create = async (day) => {
    await dispatch(addMealInDay(day));
  };

  const del = async (day) => {
    await dispatch(removeMealInDay(day));
  };

  return {
    create,
    del,
  };
};

export default useMeals;
