import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

import { validateSignUpForm } from "../utils/validations";

import Toggable from "./Toggable";
import ErrorMessage from "./ErrorMessage";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeated, setPasswordRepeated] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordRules, setPasswordRules] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const { signup } = useAuth();

  useEffect(() => {
    const { isValid, errors, passwordRules } = validateSignUpForm({
      name,
      username,
      email,
      password,
      passwordRepeated,
    });

    setErrors(errors);
    setPasswordRules(passwordRules);
    setIsFormValid(isValid);
  }, [name, username, email, password, passwordRepeated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    await signup({ name, username, email, password });

    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordRepeated("");
    setErrors({});
    setPasswordRules([]);
  };

  return (
    <Toggable buttonLabel="Sign Up">
      <form onSubmit={handleSubmit} className="form-container">
        <div>
          <input
            className="input-field"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ErrorMessage message={errors.name} />
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <ErrorMessage message={errors.username} />
        </div>

        <div>
          <input
            className="input-field"
            placeholder="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorMessage message={errors.email} />
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Repeat Password"
            type="password"
            value={passwordRepeated}
            onChange={(e) => setPasswordRepeated(e.target.value)}
          />
          <ErrorMessage message={errors.passwordRepeated} />
        </div>

        {/* CLASE CSS gestiona la visibilidad y el estilo de lista */}
        <ul className={`password-requirements ${password ? "show" : ""}`}>
          {passwordRules.map((rule) => (
            <li
              key={rule.label}
              className={rule.valid ? "text-success" : "text-error"}
            >
              {rule.label}
            </li>
          ))}
        </ul>

        {/* SIN STYLE INLINE: El gap del form-container gestiona el espacio */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`btn btn-primary ${!isFormValid ? "btn-disabled" : ""}`}
        >
          Confirm
        </button>
      </form>
    </Toggable>
  );
};

export default SignUpForm;
