import { useLocation } from "react-router-dom";
import { useState } from "react";

function BookingDetails() {
  const location = useLocation();
  const { train, from, to, date } = location.state || {};
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "", coach: "" },
  ]);

  // 🔢 Handle passenger count
  const handlePassengerCount = (value) => {
    const count = parseInt(value) || 0;
    setNumPassengers(count);

    const newPassengers = [];
    for (let i = 0; i < count; i++) {
      newPassengers.push({
        name: "",
        age: "",
        gender: "",
        coach: "",
      });
    }
    setPassengers(newPassengers);
  };

  // ✏️ Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // 🚀 CONFIRM BOOKING
  const confirmBooking = async () => {
    if (loading) return; // 🔒 prevent multiple clicks

    if (!phone) {
      alert("Phone number is required");
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age || !p.gender || !p.coach) {
        alert(`Fill all details for Passenger ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true); // 🔒 disable button

      const payload = {
        train_id: train.train_id,
        journey_date: date,
        phone_number: phone,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender.toUpperCase(),
          coach_type: p.coach.toUpperCase(),
        })),
      };

      const res = await fetch(
        "http://127.0.0.1:8000/user/ticket-booking/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        console.log("BACKEND ERROR:", err);
        alert(err.detail || JSON.stringify(err));
        setLoading(false);
        return;
      }

      const data = await res.json();

      alert(`Booking Successful!\nPNR: ${data.pnr}`);

      // ✅ redirect properly
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Booking Details</h2>

      {/* 🚆 TRAIN INFO */}
      <div>
        <p>
          <b>Train:</b> {train?.train_name}
        </p>
        <p>
          <b>Train Number:</b> {train?.train_number}
        </p>
        <p>
          <b>Source:</b> {from}
        </p>
        <p>
          <b>Destination:</b> {to}
        </p>
        <p>
          <b>Date:</b> {date}
        </p>
      </div>

      <hr />

      {/* 📞 PHONE */}
      <div>
        <label>Phone Number: </label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <hr />

      {/* 👥 NUMBER OF PASSENGERS */}
      <div>
        <label>No. of Passengers: </label>
        <input
          type="number"
          min="1"
          value={numPassengers}
          onChange={(e) => handlePassengerCount(e.target.value)}
        />
      </div>

      <hr />

      {/* 🧾 PASSENGER DETAILS */}
      <h3>Passenger Details</h3>

      {passengers.map((p, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <h4>Passenger {index + 1}</h4>

          <input
            placeholder="Name"
            value={p.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />

          <input
            placeholder="Age"
            value={p.age}
            onChange={(e) => handleChange(index, "age", e.target.value)}
          />

          <select
            value={p.gender}
            onChange={(e) =>
              handleChange(index, "gender", e.target.value)
            }
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Others</option>
          </select>

          <select
            value={p.coach}
            onChange={(e) =>
              handleChange(index, "coach", e.target.value)
            }
          >
            <option value="">Select Coach</option>
            <option value="GS">GS</option>
            <option value="SL">SL</option>
            <option value="3A">3A</option>
            <option value="2A">2A</option>
            <option value="1A">1A</option>
            <option value="CC">CC</option>
            <option value="2S">2S</option>
          </select>
        </div>
      ))}

      <hr />

      {/* ✅ CONFIRM BUTTON */}
      <button onClick={confirmBooking} disabled={loading}>
        {loading ? "Booking..." : "Confirm & Book"}
      </button>
    </div>
  );
}

export default BookingDetails;
