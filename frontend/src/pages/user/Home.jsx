import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Railway Management System</h1>

      <div style={{ marginTop: "30px" }}>
        
        {/* ✅ FIXED ROUTE */}
        <Link to="/ticket-booking">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Book Ticket
          </button>
        </Link>

        <Link to="/cancellation">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            My Bookings
          </button>
        </Link>

        <Link to="/status">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Check Train Status
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Home;