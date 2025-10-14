import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Toggable from "./Toggable";
import { validateSignUpForm } from "../utils/validations";
import ErrorMessage from "./ErrorMessage";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeated, setPasswordRepeated] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordRules, setPasswordRules] = useState([]);

  const { signup } = useAuth();

  const handlePasswordChange = (value) => {
    setPassword(value);
    const { passwordRules } = validateSignUpForm({
      name,
      username,
      email,
      password: value,
      passwordRepeated,
    });
    setPasswordRules(passwordRules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors, passwordRules } = validateSignUpForm({
      name,
      username,
      email,
      password,
      passwordRepeated,
    });
    setErrors(errors);
    setPasswordRules(passwordRules);

    if (!isValid) return;

    await signup({ name, username, email, password });

    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordRepeated("");
    setErrors({});
    setPasswordRules({});
  };

  const isPasswordValid =
    passwordRules.length > 0 && passwordRules.every((rule) => rule.valid);

  return (
    <Toggable buttonLabel="Sign Up">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <ErrorMessage message={errors.name} />

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <ErrorMessage message={errors.username} />

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
          onChange={({ target }) => handlePasswordChange(target.value)}
        />
        <ErrorMessage message={errors.password} />

        <input
          className="input"
          placeholder="Repeat Password"
          type="password"
          value={passwordRepeated}
          onChange={({ target }) => setPasswordRepeated(target.value)}
        />
        <ErrorMessage message={errors.passwordRepeated} />

        <ul className={`password-requirements ${password ? "show" : ""}`}>
          {passwordRules.map((rule) => (
            <li
              key={rule.label}
              style={{ color: rule.valid ? "#4caf50" : "#f44336" }}
            >
              {rule.label}
            </li>
          ))}
        </ul>

        <br />
        <button
          type="submit"
          disabled={!isPasswordValid}
          className={`button ${!isPasswordValid ? "button-disabled" : "button-enabled"}`}
        >
          Confirm
        </button>
      </form>
    </Toggable>
  );
};

export default SignUpForm;
