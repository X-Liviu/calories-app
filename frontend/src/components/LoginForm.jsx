import { useState } from "react";

import useAuth from "../hooks/useAuth";

import { validateLoginForm } from "../utils/validations";

import Toggable from "./Toggable";
import ErrorMessage from "./ErrorMessage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateLoginForm({ email, password });
    setErrors(errors);

    if (!isValid) return;

    await login({ email, password });

    setEmail("");
    setPassword("");
    setErrors({});
  };

  const { isValid } = validateLoginForm({ email, password });

  return (
    <Toggable buttonLabel="Log In">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="E-Mail"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
        <ErrorMessage message={errors.email} />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <ErrorMessage message={errors.password} />

        <br />
        <button
          type="submit"
          disabled={!isValid}
          className={`${!isValid ? "button-disabled" : "button-enabled"}`}
        >
          Confirm
        </button>
      </form>
    </Toggable>
  );
};

export default LoginForm;
