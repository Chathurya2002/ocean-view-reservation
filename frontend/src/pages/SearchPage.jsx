import { useState } from "react";
import axios from "axios";

export default function SearchPage() {
  const [form, setForm] = useState({
    reservationNumber: "",
    guestName: "",
    checkInDate: "",
    checkOutDate: "",
    roomType: "STANDARD",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/reservations", {
        ...form,
        address: "Colombo",
        contactNumber: "0771234567",
      });

      alert("Reservation Added ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={styles.bg}>
      <h1 style={{ color: "white" }}>Ocean View Resort</h1>

      <div style={styles.box}>
        <input name="reservationNumber" placeholder="Reservation No" onChange={handleChange} />
        <input name="guestName" placeholder="Guest Name" onChange={handleChange} />
        <input type="date" name="checkInDate" onChange={handleChange} />
        <input type="date" name="checkOutDate" onChange={handleChange} />

        <select name="roomType" onChange={handleChange}>
          <option>STANDARD</option>
          <option>DELUXE</option>
          <option>SUITE</option>
        </select>

        <button onClick={handleSubmit}>Reserve</button>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f2027",
  },
  box: {
    display: "flex",
    gap: "10px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
};
