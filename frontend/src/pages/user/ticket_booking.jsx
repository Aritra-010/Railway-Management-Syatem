import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TicketBooking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const navigate = useNavigate();

  // 🔹 Fetch stations
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/stations")
      .then((res) => res.json())
      .then((data) => setStations(data.stations || []))
      .catch(() => setStations([]));
  }, []);

  // 🔍 Search trains
  const searchTrains = async () => {
    if (!stations.includes(from) || !stations.includes(to)) {
      alert("Select valid stations");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/user/ticket-booking/search?source=${from}&destination=${to}`
      );
      const data = await res.json();
      setTrains(data.trains || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🚆 Navigate to booking page
  const handleBook = (train) => {
    navigate("/booking-details", {
      state: { train, from, to, date }
    });
  };

  // 🔍 Filter helper
  const filterStations = (value) =>
    stations.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>

      <h2 style={{ textAlign: "center" }}>Search Trains</h2>

      {/* FROM + TO SIDE BY SIDE */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

        {/* FROM */}
        <div style={{ flex: 1, position: "relative" }}>
          <input
            placeholder="From Station"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setShowFrom(true);
            }}
            style={{ width: "100%", padding: "8px" }}
          />

          {showFrom && (
            <div style={{
              border: "1px solid #ccc",
              background: "#fff",
              position: "absolute",
              width: "100%",
              zIndex: 10
            }}>
              {filterStations(from).map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setFrom(s);
                    setShowFrom(false);
                  }}
                  style={{ padding: "8px", cursor: "pointer" }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TO */}
        <div style={{ flex: 1, position: "relative" }}>
          <input
            placeholder="To Station"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setShowTo(true);
            }}
            style={{ width: "100%", padding: "8px" }}
          />

          {showTo && (
            <div style={{
              border: "1px solid #ccc",
              background: "#fff",
              position: "absolute",
              width: "100%",
              zIndex: 10
            }}>
              {filterStations(to).map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setTo(s);
                    setShowTo(false);
                  }}
                  style={{ padding: "8px", cursor: "pointer" }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* DATE */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      />

      {/* BUTTON */}
      <button
        onClick={searchTrains}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        Search Trains
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* TRAIN LIST */}
      {trains.length === 0 ? (
        <p style={{ textAlign: "center" }}>No trains found</p>
      ) : (
        trains.map((train) => (
          <div
            key={train.train_id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <h4>{train.train_name}</h4>
            <p>Train No: {train.train_number}</p>

            <button
              onClick={() => handleBook(train)}
              style={{
                background: "green",
                color: "white",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Book
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketBooking;