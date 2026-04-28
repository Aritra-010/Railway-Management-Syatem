import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./pages/Navbar";

import Admin from "./pages/admin/Admin";
import AddStation from "./pages/admin/AddStation";
import AddTrain from "./pages/admin/AddTrain";
import ConnectTrain from "./pages/admin/ConnectTrain";
import BookingDetails from "./pages/user/booking_details";

import Home from "./pages/user/Home";
import TicketBooking from "./pages/user/ticket_booking";
import TrainStatus from "./pages/user/TrainStatus";
import MyBooking from "./pages/user/my_booking";


function App() {
  return (
    <BrowserRouter>
  <Navbar />

  <div style={{ marginTop: "70px" }}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/home" element={<Home />} />
      <Route path="/ticket-booking" element={<TicketBooking />} />
      <Route path="/status" element={<TrainStatus />} />
      <Route path="/booking-details" element={<BookingDetails />} />
      <Route path="/my-booking" element={<MyBooking />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/add-station" element={<AddStation />} />
      <Route path="/admin/add-train" element={<AddTrain />} />
      <Route path="/admin/connect" element={<ConnectTrain />} />
    </Routes>
  </div>
</BrowserRouter>
  );
}

export default App;