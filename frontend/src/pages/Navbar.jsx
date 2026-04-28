import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav style={styles.navbar}>
      {/* LEFT */}
      <div onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        Railway Management System
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <Link to="/home" style={styles.link}>
          Dashboard
        </Link>

        <span onClick={() => setDarkMode(!darkMode)} style={styles.link}>
          {darkMode ? "Light" : "Dark"}
        </span>

        <span onClick={() => navigate("/profile")} style={styles.link}>
          Profile
        </span>
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#1e293b",
    color: "white",
  },
  right: {
    display: "flex",
    gap: "10px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
  },
};
