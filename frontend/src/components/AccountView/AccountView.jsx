import { useSelector } from "react-redux";

import Logout from "./Logout";

const AccountView = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <h2>{user.name}, you logged in succesfully!</h2>
      <Logout />
    </>
  );
};

export default AccountView;
