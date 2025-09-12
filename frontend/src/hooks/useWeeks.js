import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveGlobalWeeks, addWeek, removeWeek } from "../reducers/weekReducer";

const useWeeks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const get = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(saveGlobalWeeks());
    } catch (err) {
      setError(err.message || "Failed to get weeks");
    } finally {
      setLoading(false);
    }
  };

  const create = async (week) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(addWeek(week));
    } catch (err) {
      setError(err.message || "Failed to add week");
    } finally {
      setLoading(false);
    }
  };

  const del = async (week) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(removeWeek(week));
    } catch (err) {
      setError(err.message || "Failed to remove week");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []); //eslint-disable-line

  return {
    get,
    create,
    del,
    loading,
    error,
  };
};

export default useWeeks;
