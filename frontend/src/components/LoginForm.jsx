import { useState } from "react";
import useLogin from "../hooks/useLogin";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });

    setEmail("");
    setPassword("");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="E-Mail"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <br />
        <button>Log In</button>
      </form>
    </>
  );
};

export default LoginForm;
