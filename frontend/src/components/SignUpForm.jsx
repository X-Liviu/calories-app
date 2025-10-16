import { useState, useEffect } from "react";
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
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ErrorMessage message={errors.name} />

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <ErrorMessage message={errors.username} />

        <input
          className="input"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ErrorMessage message={errors.email} />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input"
          placeholder="Repeat Password"
          type="password"
          value={passwordRepeated}
          onChange={(e) => setPasswordRepeated(e.target.value)}
        />

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
          disabled={!isFormValid}
          className={`${!isFormValid ? "button-disabled" : "button-enabled"}`}
        >
          Confirm
        </button>
      </form>
    </Toggable>
  );
};

export default SignUpForm;
