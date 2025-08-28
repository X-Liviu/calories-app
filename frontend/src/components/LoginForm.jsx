import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Toggable from "./Toggable";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });

    setEmail("");
    setPassword("");
  };
  //Para repasar lo aprendido en fullstackopen (Toggable).
  return (
    <Toggable buttonLabel="Log In">
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
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <br />
        <button>Log In</button>
      </form>
    </Toggable>
  );
};

export default LoginForm;
