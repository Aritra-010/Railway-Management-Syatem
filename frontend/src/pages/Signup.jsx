import { Link } from "react-router-dom";

function Signup() {
  return (
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" />
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Signup</button>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;