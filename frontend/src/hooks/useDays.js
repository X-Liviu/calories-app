import { useDispatch } from "react-redux";
import { addDayInWeek, removeDayInWeek } from "../reducers/weekReducer";

const useDays = () => {
  const dispatch = useDispatch();
  const create = async (day) => {
    await dispatch(addDayInWeek(day));
  };

  const del = async (day) => {
    await dispatch(removeDayInWeek(day));
  };

  return {
    create,
    del,
  };
};

export default useDays;
