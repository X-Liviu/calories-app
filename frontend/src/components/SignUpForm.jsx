import { useState } from "react";
import useSignup from "../hooks/useSignup";
const SignUpForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeated, setPasswordRepeated] = useState("");
  const { signup } = useSignup();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordRepeated) {
      signup({});

      setName("");
      setEmail("");
      setPassword("");
      setPasswordRepeated("");
    } else {
      console.log("passwords must match"); //Cambiar esto obviamente después.
    }
  };
  return (
    <>
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
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <input
          className="input"
          placeholder="Repeat Password"
          value={passwordRepeated}
          onChange={({ target }) => setPasswordRepeated(target.value)}
        />
        <br />
        <button>Sign Up</button>
      </form>
    </>
  );
};

export default SignUpForm;
