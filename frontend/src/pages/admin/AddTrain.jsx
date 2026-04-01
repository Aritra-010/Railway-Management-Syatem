import { useState } from "react";

function AddTrain() {
  const [form, setForm] = useState({
    train_number: "",
    train_name: "",
    train_type: "",
    source: "",
    destination: "",
    total_coaches: "",
    total_seats: "",
    gs_seats: "",
    sl_seats: "",
    third_ac_seats: "",
    second_ac_seats: "",
    first_ac_seats: "",
    cc_seats: "",
    second_sitting_seats: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // ✅ Basic validation
    if (
      !form.train_number ||
      !form.train_name ||
      !form.train_type ||
      !form.source ||
      !form.destination
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/admin/add-train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          total_coaches: Number(form.total_coaches || 0),
          total_seats: Number(form.total_seats || 0),
          gs_seats: Number(form.gs_seats || 0),
          sl_seats: Number(form.sl_seats || 0),
          third_ac_seats: Number(form.third_ac_seats || 0),
          second_ac_seats: Number(form.second_ac_seats || 0),
          first_ac_seats: Number(form.first_ac_seats || 0),
          cc_seats: Number(form.cc_seats || 0),
          second_sitting_seats: Number(form.second_sitting_seats || 0),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Train added successfully 🚆");

        // 🧹 Clear form
        setForm({
          train_number: "",
          train_name: "",
          train_type: "",
          source: "",
          destination: "",
          total_coaches: "",
          total_seats: "",
          gs_seats: "",
          sl_seats: "",
          third_ac_seats: "",
          second_ac_seats: "",
          first_ac_seats: "",
          cc_seats: "",
          second_sitting_seats: "",
        });
      } else {
        alert(result.error || "Error adding train");
      }

    } catch (error) {
      console.error(error);
      alert("Backend connection error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Add Train</h2>

      <input name="train_number" placeholder="Train Number" value={form.train_number} onChange={handleChange} /><br />
      <input name="train_name" placeholder="Train Name" value={form.train_name} onChange={handleChange} /><br />
      <input name="train_type" placeholder="Train Type (local/express)" value={form.train_type} onChange={handleChange} /><br />
      <input name="source" placeholder="Source" value={form.source} onChange={handleChange} /><br />
      <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} /><br />

      <input name="total_coaches" placeholder="Total Coaches" value={form.total_coaches} onChange={handleChange} /><br />
      <input name="total_seats" placeholder="Total Seats" value={form.total_seats} onChange={handleChange} /><br />

      <input name="gs_seats" placeholder="GS Seats" value={form.gs_seats} onChange={handleChange} /><br />
      <input name="sl_seats" placeholder="SL Seats" value={form.sl_seats} onChange={handleChange} /><br />
      <input name="third_ac_seats" placeholder="3A Seats" value={form.third_ac_seats} onChange={handleChange} /><br />
      <input name="second_ac_seats" placeholder="2A Seats" value={form.second_ac_seats} onChange={handleChange} /><br />
      <input name="first_ac_seats" placeholder="1A Seats" value={form.first_ac_seats} onChange={handleChange} /><br />
      <input name="cc_seats" placeholder="CC Seats" value={form.cc_seats} onChange={handleChange} /><br />
      <input name="second_sitting_seats" placeholder="2S Seats" value={form.second_sitting_seats} onChange={handleChange} /><br />

      <button onClick={handleSubmit}>Add Train</button>
    </div>
  );
}

export default AddTrain;