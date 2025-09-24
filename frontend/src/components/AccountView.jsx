import { useSelector } from "react-redux";
const AccountView = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <div>{user.name}, you logged in succesfully!</div>
    </>
  );
};

export default AccountView;
