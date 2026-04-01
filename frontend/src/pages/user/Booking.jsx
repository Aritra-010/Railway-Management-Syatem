import { useState } from "react";

function Booking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const handleSearch = () => {
    console.log(from, to, date);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Search Trains</h2>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="From Station"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ margin: "10px", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="To Station"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ margin: "10px", padding: "8px" }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ margin: "10px", padding: "8px" }}
        />
      </div>

      <button
        onClick={handleSearch}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Search Trains
      </button>
    </div>
  );
}

export default Booking;
