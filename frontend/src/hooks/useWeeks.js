import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addWeek, saveGlobalWeeks } from "../reducers/weekReducer";

const useWeeks = () => {
  const dispatch = useDispatch();
  const get = async () => {
    await dispatch(saveGlobalWeeks());
  };

  useEffect(() => {
    get();
  });

  const create = async (week) => {
    await dispatch(addWeek(week));
  };

  return {
    get,
    create,
  };
};

export default useWeeks;
