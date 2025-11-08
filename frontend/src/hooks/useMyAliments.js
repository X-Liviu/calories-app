import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  saveMyAliments,
  addMyAliment,
  removeMyAliment,
  changeMyAliment,
} from "../reducers/myAlimentReducer";

const useMyAliments = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user?.token);

  const get = useCallback(async () => {
    if (token) {
      await dispatch(saveMyAliments());
    }
  }, [dispatch, token]);

  const create = async (myAliment) => {
    if (token) await dispatch(addMyAliment(myAliment));
  };

  const update = async (myAliment) => {
    if (token) await dispatch(changeMyAliment(myAliment));
  };
  const del = async (myAliment) => {
    if (token) await dispatch(removeMyAliment(myAliment));
  };

  return { get, create, update, del };
};

export default useMyAliments;
