import { useDispatch } from "react-redux";
import {
  saveMyAliments,
  addMyAliment,
  removeMyAliment,
} from "../reducers/myAlimentReducer";

const useMyAliments = () => {
  const dispatch = useDispatch();
  const get = async () => {
    await dispatch(saveMyAliments());
  };

  const create = async (myAliment) => {
    await dispatch(addMyAliment(myAliment));
  };

  const del = async (myAliment) => {
    await dispatch(removeMyAliment(myAliment));
  };

  return {
    get,
    create,
    del,
  };
};

export default useMyAliments;
