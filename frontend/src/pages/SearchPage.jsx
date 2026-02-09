import { useState } from "react";
import axios from "axios";

export default function SearchPage() {
  // Reservation form
  const [form, setForm] = useState({
    reservationNumber: "",
    guestName: "",
    checkInDate: "",
    checkOutDate: "",
    roomType: "STANDARD",
  });

  // Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Auth forms (UI only for now)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleReservation = async () => {
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

  // Login/Register (UI only)
  const submitLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      alert("Please fill email & password");
      return;
    }
    alert("Login clicked (UI only) ✅");
    setShowLogin(false);
  };

  const submitRegister = () => {
    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Register clicked (UI only) ✅");
    setShowRegister(false);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.brand}>OceanView.com</div>

        <div style={styles.headerRight}>
          <button
            style={styles.headerBtnOutline}
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
          <button style={styles.headerBtn} onClick={() => setShowLogin(true)}>
            Sign in
          </button>
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

          <button onClick={handleReservation} style={styles.reserveBtn}>
            Search / Reserve
          </button>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={styles.overlay} onClick={() => setShowLogin(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Sign in</h2>
              <button style={styles.closeBtn} onClick={() => setShowLogin(false)}>
                ✕
              </button>
            </div>

            <input
              style={styles.modalInput}
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <input
              style={styles.modalInput}
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />

            <button style={styles.modalPrimaryBtn} onClick={submitLogin}>
              Sign in
            </button>

            <p style={styles.modalText}>
              No account?{" "}
              <span
                style={styles.link}
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div style={styles.overlay} onClick={() => setShowRegister(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Register</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowRegister(false)}
              >
                ✕
              </button>
            </div>

            <input
              style={styles.modalInput}
              placeholder="Full Name"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
            />
            <input
              style={styles.modalInput}
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
            />
            <input
              style={styles.modalInput}
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
            />
            <input
              style={styles.modalInput}
              type="password"
              placeholder="Confirm Password"
              value={registerForm.confirmPassword}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button style={styles.modalPrimaryBtn} onClick={submitRegister}>
              Create account
            </button>

            <p style={styles.modalText}>
              Already have an account?{" "}
              <span
                style={styles.link}
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      )}
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
  headerRight: { display: "flex", gap: "10px" },
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

  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "12px",
    padding: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },
  modalInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    outline: "none",
  },
  modalPrimaryBtn: {
    width: "100%",
    background: "#0071c2",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "6px",
  },
  modalText: { marginTop: "10px", marginBottom: 0, fontSize: "14px" },
  link: { color: "#0071c2", cursor: "pointer", fontWeight: 600 },
};
