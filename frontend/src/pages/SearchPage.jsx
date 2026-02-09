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
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.brand}>OceanView.com</div>

        <div style={styles.headerRight}>
          <button style={styles.headerBtnOutline}>Register</button>
          <button style={styles.headerBtn}>Sign in</button>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Ocean View Resort</h1>
        <p style={styles.heroSub}>
          Book your stay with best prices and simple reservation.
        </p>

        {/* SEARCH BOX */}
        <div style={styles.box}>
          <input
            name="reservationNumber"
            placeholder="Reservation No"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="guestName"
            placeholder="Guest Name"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="date"
            name="checkInDate"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="date"
            name="checkOutDate"
            onChange={handleChange}
            style={styles.input}
          />
          <select name="roomType" onChange={handleChange} style={styles.input}>
            <option>STANDARD</option>
            <option>DELUXE</option>
            <option>SUITE</option>
          </select>

          <button onClick={handleSubmit} style={styles.reserveBtn}>
            Search / Reserve
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(120deg,#0f2027,#203a43,#2c5364)",
  },

  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    color: "white",
  },
  brand: {
    fontWeight: 700,
    letterSpacing: "0.5px",
    fontSize: "20px",
  },
  headerRight: {
    display: "flex",
    gap: "10px",
  },
  headerBtnOutline: {
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.6)",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  headerBtn: {
    background: "#0071c2",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  hero: {
    paddingTop: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  heroTitle: { color: "white", marginBottom: "6px" },
  heroSub: { color: "rgba(255,255,255,0.8)", marginBottom: "22px" },

  box: {
    background: "white",
    padding: "18px",
    borderRadius: "12px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    maxWidth: "980px",
    width: "100%",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minWidth: "160px",
  },
  reserveBtn: {
    background: "#0071c2",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
