import { useState, useEffect } from "react";

function AddStation() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [stations, setStations] = useState([]);

  // 🔄 Fetch all stations from backend
  const fetchStations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/stations");
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // 🚀 Run on page load
  useEffect(() => {
    fetchStations();
  }, []);

  // ➕ Add station
  const handleAddStation = async () => {
    if (!name || !code || !city) {
      alert("Please fill all fields");
      return;
    }

    const data = {
      name: name,
      code: code,
      city: city,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/add-station", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Station added successfully 🚆");

        // 🔄 Refresh full list from DB
        fetchStations();

        // 🧹 Clear inputs
        setName("");
        setCode("");
        setCity("");
      } else {
        alert(result.error || "Error adding station");
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Add Station</h2>

      <input
        placeholder="Station Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="Station Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />

      <button onClick={handleAddStation}>Add Station</button>

      <h3>Stations List</h3>

      {stations.map((s, index) => (
        <p key={index}>
          {s.name} ({s.code}) - {s.city}
        </p>
      ))}
    </div>
  );
}

export default AddStation;