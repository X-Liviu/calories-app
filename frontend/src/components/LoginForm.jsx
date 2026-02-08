import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validations";
import Toggable from "./Toggable";
import ErrorMessage from "./ErrorMessage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { login } = useAuth();

  // --- ESTADO DERIVADO ---
  // Se recalcula automáticamente cada vez que escribes una letra.
  // No hace falta useEffect ni useState para 'errors'.
  const { errors, isValid } = validateLoginForm({ email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) return;

    await login({ email, password });

    setEmail("");
    setPassword("");
    setSubmitted(false);
  };

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
          <ErrorMessage message={submitted || email ? errors.email : null} />
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
          className={`btn btn-primary ${!isValid ? "btn-disabled" : ""}`}
        >
          Confirm
        </button>
      </form>
    </Toggable>
  );
};

export default LoginForm;
