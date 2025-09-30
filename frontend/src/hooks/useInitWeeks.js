import { useDispatch, useSelector } from "react-redux";
import { saveGlobalWeeks } from "../reducers/weekReducer";

const useInitWeeks = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const get = async () => {
    if (user?.token) {
      await dispatch(saveGlobalWeeks());
    }
  };

  return {
    get,
  };
};

export default useInitWeeks;
