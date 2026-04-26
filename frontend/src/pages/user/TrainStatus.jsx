import { useState, useEffect } from "react";

function TrainStatus() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  // 🔹 Fetch stations
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/stations")
      .then(res => res.json())
      .then(data => setStations(data.stations || []))
      .catch(() => setStations([]));
  }, []);

  // 🔍 Search trains
  const handleSearch = async () => {
    if (!from || !to) {
      alert("Select both stations");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/user/train-status?source=${from}&destination=${to}`
      );

      const data = await res.json();
      setTrains(data.trains || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      
      <h2>Check Train Status</h2>

      {/* FROM */}
      <select
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option value="">Select From Station</option>
        {stations.map((s, i) => (
          <option key={i} value={s}>{s}</option>
        ))}
      </select>

      {/* TO */}
      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option value="">Select To Station</option>
        {stations.map((s, i) => (
          <option key={i} value={s}>{s}</option>
        ))}
      </select>

      {/* BUTTON */}
      <button
        onClick={handleSearch}
        style={{
          width: "100%",
          padding: "10px",
          background: "blue",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Search
      </button>

      <hr />

      {/* RESULTS */}
      {trains.length === 0 ? (
        <p>No trains found</p>
      ) : (
        trains.map((train, index) => (
          <div key={index} style={{ marginTop: "10px" }}>
            <p><b>{train.train_name}</b></p>
            <p>{train.train_number}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TrainStatus;