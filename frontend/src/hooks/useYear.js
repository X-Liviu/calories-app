import { useDispatch } from "react-redux";

import { setYear } from "../reducers/yearReducer";

const useYear = () => {
  const dispatch = useDispatch();
  const update = (year) => {
    dispatch(setYear(year));
  };

  return { update };
};

export default useYear;
