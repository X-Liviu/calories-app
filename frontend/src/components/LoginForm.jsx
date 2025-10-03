import { useState } from "react";
import useAuth from "../hooks/useAuth";

import Toggable from "./Toggable";
import { loginSchema } from "../utils/validations";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); //provisional
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      login({ email, password });
    } catch (err) {
      setError(err); //provisional
      setTimeout(() => setError(null), 5000); //provisional
    }

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
        <p>{error?.message /*provisional */}</p>
        <br />
        <button>Confirm</button>
      </form>
    </Toggable>
  );
};

export default LoginForm;
