// useMyAliments.js
import { useDispatch, useSelector } from "react-redux";
import {
  saveMyAliments,
  addMyAliment,
  removeMyAliment,
} from "../reducers/myAlimentReducer";

const useMyAliments = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const get = async () => {
    if (user?.token) {
      await dispatch(saveMyAliments());
    }
  };

  const create = async (myAliment) => {
    if (user?.token) await dispatch(addMyAliment(myAliment));
  };

  const del = async (myAliment) => {
    if (user?.token) await dispatch(removeMyAliment(myAliment));
  };

  return { get, create, del };
};

export default useMyAliments;
