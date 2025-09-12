import axios from "axios";
const baseUrl = "/api/users";

const signup = async (userInfo) => {
  console.log(userInfo);
  const response = await axios.post(baseUrl, userInfo);
  return response.data;
};

export default {
  signup,
};
