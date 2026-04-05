import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TicketBooking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [trains, setTrains] = useState([]);

  const navigate = useNavigate();

  // 🔍 SEARCH TRAINS
  const searchTrains = async () => {
    try {
      const res = await fetch(
          `http://127.0.0.1:8000/user/ticket-booking/search?source=${from}&destination=${to}`

      );

      const data = await res.json();

      // backend returns { trains: [...] }
      setTrains(data.trains);
    } catch (err) {
      console.error(err);
    }
  };

  // 🚆 HANDLE BOOK BUTTON
  const handleBook = (train) => {
    navigate("/booking-details", {
      state: { train, from, to, date }
    });
  };

  return (
    <div>
      <h2>Search Trains</h2>

      {/* FROM */}
      <input
        placeholder="From Station"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      {/* TO */}
      <input
        placeholder="To Station"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      {/* DATE (not used in backend yet) */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={searchTrains}>Search Trains</button>

      <hr />

      {/* TRAIN LIST */}
      {trains.length === 0 ? (
        <p>No trains found</p>
      ) : (
        trains.map((train) => (
          <div key={train.train_id} style={{ margin: "10px" }}>
            <h4>{train.train_name}</h4>
            <p>Train No: {train.train_number}</p>

            <button onClick={() => handleBook(train)}>
              Book
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketBooking;