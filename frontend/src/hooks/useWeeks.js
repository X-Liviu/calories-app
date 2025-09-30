import { useState } from "react";
import { useDispatch } from "react-redux";
import { addWeek, removeWeek } from "../reducers/weekReducer";

const useWeeks = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const create = async (week) => {
    setError(null);
    try {
      await dispatch(addWeek(week));
    } catch (err) {
      setError(err.message || "Failed to add week");
    }
  };

  const del = async (week) => {
    setError(null);
    try {
      await dispatch(removeWeek(week));
    } catch (err) {
      setError(err.message || "Failed to remove week");
    }
  };

  return {
    create,
    del,
    error,
  };
};

export default useWeeks;
