import "./App.css";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

const App = () => {
  return (
    <>
      <h1>CALORIES TRACKER</h1>
      <img
        src="/jayCutler.gif"
        alt="Jay Cutler"
        style={{
          width: "200px",
          display: "block",
          margin: "20px auto",
          borderRadius: "20px",
        }}
      />
      <LoginForm />
      <SignUpForm />
    </>
  );
};

export default App;
