import { Link } from "react-router-dom";
import "./Login.css";


function Login() {
  return (
    <div>
      <h2>Login</h2>
      <input className="login-input" type="text" placeholder="Email" />
      <input className="login-input" type="password" placeholder="Password" />
      <button className="login-button">Login</button>

      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;