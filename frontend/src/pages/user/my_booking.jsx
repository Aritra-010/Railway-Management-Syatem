import { useState } from "react";

function MyBooking() {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState(null);

  // 🔍 Fetch booking by PNR
  const handleSearch = async () => {
    if (!pnr) {
      alert("Please enter PNR");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/user/my-bookings/${pnr}`
      );

      const data = await res.json();
      console.log("API RESPONSE:", data);

      setBooking(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}
    >
      <h2 style={{ textAlign: "center" }}>My Booking</h2>

      {/* 🔹 PNR INPUT */}
      <input
        type="text"
        placeholder="Enter PNR"
        value={pnr}
        onChange={(e) => setPnr(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      {/* 🔹 BUTTON */}
      <button
        onClick={handleSearch}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Get Booking
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* 🔹 DISPLAY BOOKING */}
      {booking && !booking.error && (
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3 style={{ textAlign: "center" }}>Confirmed Ticket</h3>
          <h4>Passengers:</h4>
          {booking.passengers.map((p, i) => (
            <p key={i}>
              {p.name} ({p.age}, {p.gender})
            </p>
          ))}

          {/* Route */}
          <p>
            <b>
              {booking.source} → {booking.destination}
            </b>
          </p>

          {/* Train Details */}
          <p>
            <b>Train:</b> {booking.train_name}
          </p>
          <p>
            <b>Train No:</b> {booking.train_number}
          </p>

          {/* Journey */}
          <p>
            <b>Date of Travel:</b> {booking.journey_date}
          </p>

          {/* PNR */}
          <p>
            <b>PNR:</b> {booking.pnr}
          </p>

          {/* Passenger Info */}
          <p>
            <b>Total Passengers:</b> {booking.total_passengers}
          </p>

          {/* Coach & Seats */}
          <p>
            <b>Coach:</b> {booking.coach}
          </p>
          <p>
            <b>Seat Numbers:</b> {booking.seat_numbers}
          </p>

          {/* Fare */}
          <p>
            <b>Total Fare:</b> ₹{booking.total_fare}
          </p>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Print Ticket
          </button>
        </div>
      )}

      {/* 🔴 Error */}
      {booking && booking.error && (
        <p style={{ color: "red", textAlign: "center" }}>{booking.error}</p>
      )}
    </div>
  );
}

export default MyBooking;