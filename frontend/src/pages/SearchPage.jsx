import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROOMS = [
  {
    id: "STANDARD",
    name: "Standard Room",
    price: 8500,
    desc: "Cozy room with essentials, perfect for short stays.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "DELUXE",
    name: "Deluxe Room",
    price: 13500,
    desc: "Sea-view balcony, bigger space, premium comfort.",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "SUITE",
    name: "Suite",
    price: 22000,
    desc: "Luxury suite with living area, best for families.",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c2?auto=format&fit=crop&w=1200&q=60",
  },
];

export default function SearchPage() {
 
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    reservationNumber: "",
    guestName: "",
    checkInDate: "",
    checkOutDate: "",
    roomType: "STANDARD",
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const selectedRoom = useMemo(
    () => ROOMS.find((r) => r.id === form.roomType) || ROOMS[0],
    [form.roomType]
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ LOGIN
  const submitLogin = async () => {
    try {
      if (!loginForm.email || !loginForm.password)
        return alert("Please fill email & password");

      const res = await axios.post(`${API_URL}/api/auth/login`, loginForm);

      localStorage.setItem("token", res.data.token);
      setUser({ email: loginForm.email });

      alert("Login success ✅");
      setShowLogin(false);
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  // ✅ REGISTER
  const submitRegister = async () => {
    try {
      const { name, email, password, confirmPassword } = registerForm;

      if (!name || !email || !password || !confirmPassword)
        return alert("All fields are required");

      if (password !== confirmPassword)
        return alert("Passwords do not match");

      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        confirmPassword, // backend require නම් ok
      });

      alert(res.data?.message || "Register success ✅");
      setShowRegister(false);

      // optional: open login modal after register
      setShowLogin(true);
    } catch (err) {
      alert(err.response?.data?.message || "Register error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("Logged out ✅");
  };

  // ✅ Restore user (ONLY if token exists)
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setUser({ email: "logged-in" });
  }, []);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.brand}>OceanView</div>

        <div style={styles.headerRight}>
          {user ? (
            <>
              <span style={styles.userChip}>✅ Logged in</span>
              <button style={styles.headerBtnOutline} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                style={styles.headerBtnOutline}
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
              <button
                style={styles.headerBtn}
                onClick={() => setShowLogin(true)}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <div style={styles.heroWrap}>
        <div style={styles.heroBg} />
        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>Ocean View Resort</h1>
            <p style={styles.heroSub}>
              Discover your perfect stay — select dates, choose room type, reserve.
            </p>

            <div style={styles.box}>
              <input
                name="checkInDate"
                type="date"
                value={form.checkInDate}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                name="checkOutDate"
                type="date"
                value={form.checkOutDate}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="STANDARD">STANDARD</option>
                <option value="DELUXE">DELUXE</option>
                <option value="SUITE">SUITE</option>
              </select>

              <button
                onClick={() =>
                  alert(
                    `Search later ✅ (${selectedRoom.name}) from ${form.checkInDate} to ${form.checkOutDate}`
                  )
                }
                style={styles.reserveBtn}
              >
                Search
              </button>
            </div>

            <div style={styles.selectedRoomNote}>
              Selected: <b>{selectedRoom.name}</b> — LKR{" "}
              {selectedRoom.price.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ROOMS SECTION */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Rooms</h2>
          <p style={styles.sectionSub}>Pick a room type.</p>
        </div>

        <div style={styles.roomGrid}>
          {ROOMS.map((room) => (
            <div key={room.id} style={styles.roomCard}>
              <div
                style={{
                  ...styles.roomImg,
                  backgroundImage: `url(${room.image})`,
                }}
              />
              <div style={styles.roomBody}>
                <div style={styles.roomTopRow}>
                  <h3 style={styles.roomName}>{room.name}</h3>
                  <span style={styles.roomPrice}>
                    LKR {room.price.toLocaleString()}
                  </span>
                </div>
                <p style={styles.roomDesc}>{room.desc}</p>

                <button
                  style={styles.roomPrimaryBtn}
                  onClick={() => setForm((p) => ({ ...p, roomType: room.id }))}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
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

            <div style={styles.socialRow}>
              <button style={styles.socialBtn} onClick={() => alert("Google later ✅")}>
                <FcGoogle size={26} />
              </button>
              <button style={styles.socialBtn} onClick={() => alert("Apple later ✅")}>
                <FaApple size={24} />
              </button>
              <button style={styles.socialBtn} onClick={() => alert("Facebook later ✅")}>
                <FaFacebookF size={22} color="#1877f2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div style={styles.overlay} onClick={() => setShowRegister(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Register</h2>
              <button style={styles.closeBtn} onClick={() => setShowRegister(false)}>
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
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", width: "100vw", overflowX: "hidden", background: "#0b1220", backgroundSize: "cover", backgroundPosition: "center" },
  header: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 22px",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(11,18,32,0.55)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: { fontWeight: 800, fontSize: "20px" },
  headerRight: { display: "flex", gap: "10px", alignItems: "center" },
  userChip: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  headerBtnOutline: {
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.45)",
    padding: "9px 14px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  headerBtn: {
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "white",
    border: "none",
    padding: "9px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },

  heroWrap: { position: "relative", minHeight: "520px", overflow: "hidden" },
  heroBg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url(https://secure.365villas.com/getimage/uploads/config/eden/property/gallery/20/20250602_064322_1929jpg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: "scale(1.03)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(11,18,32,0.92) 0%, rgba(11,18,32,0.55) 45%, rgba(11,18,32,0.92) 100%)",
  },
  heroContent: { position: "relative", zIndex: 2, padding: "72px 18px 50px", display: "flex", justifyContent: "center" },
  heroLeft: { width: "100%", maxWidth: "1080px", color: "white" },
  heroTitle: { margin: 0, fontSize: "48px" },
  heroSub: { marginTop: "10px", marginBottom: "18px", color: "rgba(138, 132, 132, 0.82)", maxWidth: "720px" },

  box: {
    background: "rgba(192, 185, 185, 0.92)",
    padding: "14px",
    borderRadius: "16px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    boxShadow: "0 18px 45px rgba(20, 19, 19, 0.35)",
    width: "100%",
    alignItems: "center",
  },
  input: { padding: "11px 12px", borderRadius: "12px", border: "1px solid rgba(10, 9, 9, 0.12)", minWidth: "170px", outline: "none", background: "rgba(192, 185, 185, 0.92)" },
  reserveBtn: { background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", padding: "11px 18px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 800 },
  selectedRoomNote: { marginTop: "10px", color: "rgba(231, 226, 226, 0.85)", fontSize: "14px" },

  section: { padding: "40px 18px 70px", maxWidth: "1080px", margin: "0 auto" },
  sectionHeader: { marginBottom: "18px" },
  sectionTitle: { color: "white", margin: 0, fontSize: "28px" },
  sectionSub: { color: "rgba(255,255,255,0.70)", marginTop: "8px" },

  roomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" },
  roomCard: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.28)" },
  roomImg: { height: "170px", backgroundSize: "cover", backgroundPosition: "center" },
  roomBody: { padding: "14px" },
  roomTopRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" },
  roomName: { color: "white", margin: 0, fontSize: "18px" },
  roomPrice: { color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: "14px" },
  roomDesc: { color: "rgba(255,255,255,0.72)", fontSize: "13px", lineHeight: 1.4, marginTop: "8px", marginBottom: "12px" },
  roomPrimaryBtn: { width: "100%", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", border: "none", padding: "10px", borderRadius: "12px", cursor: "pointer", fontWeight: 800 },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.70)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 },
  modal: { width: "100%", maxWidth: "420px", background: "white", borderRadius: "16px", padding: "18px", boxShadow: "0 18px 45px rgba(0,0,0,0.45)" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" },
  closeBtn: { border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" },
  modalInput: { width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "10px", outline: "none" },
  modalPrimaryBtn: { width: "100%", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", padding: "11px", border: "none", borderRadius: "12px", cursor: "pointer", marginTop: "6px", fontWeight: 900 },
  socialRow: { display: "flex", justifyContent: "center", gap: "14px", marginTop: "12px" },
  socialBtn: { width: "56px", height: "56px", borderRadius: "14px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};
