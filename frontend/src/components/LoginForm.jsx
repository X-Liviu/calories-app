import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

import { validateLoginForm } from "../utils/validations";

import Toggable from "./Toggable";
import ErrorMessage from "./ErrorMessage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  useEffect(() => {
    if (email || password) {
      const { errors: validationErrors } = validateLoginForm({
        email,
        password,
      });
      setErrors(validationErrors);
    }
  }, [email, password]);

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
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <input
            className="input-field"
            placeholder="E-Mail"
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <ErrorMessage message={errors.email} />
        </div>

        <div className="form-group">
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`btn btn-primary ${!isValid ? "btn-disabled" : ""}`}
        >
          Confirm
        </button>
      </form>
    </Toggable>
  );
};

export default LoginForm;
