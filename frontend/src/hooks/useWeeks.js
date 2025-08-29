import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveGlobalWeeks, addWeek, removeWeek } from "../reducers/weekReducer";

const useWeeks = () => {
  const dispatch = useDispatch();
  const get = async () => {
    await dispatch(saveGlobalWeeks());
  };

  useEffect(() => {
    get();
  }, []); //eslint-disable-line
  const create = async (week) => {
    await dispatch(addWeek(week));
  };

  const del = async (week) => {
    await dispatch(removeWeek(week));
  };

  return {
    get,
    create,
    del,
  };
};

export default useWeeks;
