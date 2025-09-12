import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Toggable from "./Toggable";
const SignUpForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeated, setPasswordRepeated] = useState("");
  const { signup } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordRepeated) {
      signup({ name, username, email, password });

      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordRepeated("");
    } else {
      console.log("passwords must match"); //Cambiar esto obviamente después.
    }
  };
  return (
    <Toggable buttonLabel="Sign Up">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <input
          className="input"
          placeholder="E-Mail"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <input
          className="input"
          placeholder="Repeat Password"
          type="password"
          value={passwordRepeated}
          onChange={({ target }) => setPasswordRepeated(target.value)}
        />
        <br />
        <button>Sign Up</button>
      </form>
    </Toggable>
  );
};

export default SignUpForm;
