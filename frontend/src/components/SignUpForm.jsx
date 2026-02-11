import { useState } from "react";
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
  const [submitted, setSubmitted] = useState(false);

  const { signup } = useAuth();

  const { isValid, errors, passwordRules } = validateSignUpForm({
    name,
    username,
    email,
    password,
    passwordRepeated,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) return;

    const result = await signup({ name, username, email, password });

    if (result && result.success) {
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordRepeated("");
      setSubmitted(false);
    }
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
          <ErrorMessage message={submitted || name ? errors.name : null} />
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <ErrorMessage
            message={submitted || username ? errors.username : null}
          />
        </div>

        <div>
          <input
            className="input-field"
            placeholder="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorMessage message={submitted || email ? errors.email : null} />
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
          <ErrorMessage
            message={
              submitted || passwordRepeated ? errors.passwordRepeated : null
            }
          />
        </div>

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

export default SignUpForm;
