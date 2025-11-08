import { useDispatch, useSelector } from "react-redux";
import { saveGlobalWeeks } from "../reducers/weekReducer";

const useInitWeeks = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user?.token);
  const get = async (year) => {
    if (token) {
      await dispatch(saveGlobalWeeks(year));
    }
  };

  return {
    get,
  };
};

export default useInitWeeks;
