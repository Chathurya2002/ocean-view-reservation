import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Listen for storage events (e.g. from other tabs or manual changes)
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const submitLogin = async () => {
    try {
      if (!loginForm.email || !loginForm.password)
        return alert("Please fill email & password");

      const res = await axios.post(`${API_URL}/api/auth/login`, loginForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setShowLogin(false);
      alert("Login success ✅");

      if (res.data.user.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  const submitRegister = async () => {
    try {
      const { name, email, password, confirmPassword } = registerForm;
      if (!name || !email || !password || !confirmPassword)
        return alert("All fields are required");
      if (password !== confirmPassword)
        return alert("Passwords do not match");

      await axios.post(`${API_URL}/api/auth/register`, { name, email, password, confirmPassword });
      setShowRegister(false);
      setShowLogin(true);
      alert("Register success! Please log in. ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Register error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    alert("Logged out ✅");
  };

  return (
    <>
      <nav style={{
        ...styles.nav,
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        boxShadow: scrolled ? "var(--shadow)" : "none",
      }}>
        <div style={styles.container}>
          <Link to="/" style={styles.brand}>
            Ocean<span style={{ color: "var(--primary)" }}>View</span>
          </Link>

          <div style={styles.links}>
            <Link to="/" style={isActive("/") ? styles.activeLink : styles.link}>Home</Link>
            <Link to="/about" style={isActive("/about") ? styles.activeLink : styles.link}>About Us</Link>
            <Link to="/experiences" style={isActive("/experiences") ? styles.activeLink : styles.link}>Extra Trips</Link>
            <Link to="/rentals" style={isActive("/rentals") ? styles.activeLink : styles.link}>Rentals</Link>
            <Link to="/help" style={isActive("/help") ? styles.activeLink : styles.link}>Help</Link>
            {user && user.role === "admin" && (
              <Link to="/admin" style={styles.adminBtn}>Admin Portal</Link>
            )}

            {user ? (
              <div style={styles.userSection}>
                <Link to="/profile" style={styles.userLink}>
                  <span style={styles.userName}>{user.name}</span>
                </Link>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
              </div>
            ) : (
              <div style={styles.authBtns}>
                <button onClick={() => setShowLogin(true)} style={styles.loginBtn}>Sign in</button>
                <button onClick={() => setShowRegister(true)} style={styles.registerBtn}>Get Started</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={styles.overlay} onClick={() => setShowLogin(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Welcome back</h2>
              <button style={styles.closeBtn} onClick={() => setShowLogin(false)}>✕</button>
            </div>
            <input
              style={styles.modalInput}
              placeholder="Email address"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <input
              style={styles.modalInput}
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button style={styles.modalPrimaryBtn} onClick={submitLogin}>Sign in</button>
            <div style={styles.socialRow}>
              <button style={styles.socialBtn} onClick={() => alert("Coming soon")}><FcGoogle size={26} /></button>
              <button style={styles.socialBtn} onClick={() => alert("Coming soon")}><FaApple size={24} /></button>
              <button style={styles.socialBtn} onClick={() => alert("Coming soon")}><FaFacebookF size={22} color="#1877f2" /></button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div style={styles.overlay} onClick={() => setShowRegister(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Create Account</h2>
              <button style={styles.closeBtn} onClick={() => setShowRegister(false)}>✕</button>
            </div>
            <input style={styles.modalInput} placeholder="Full Name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
            <input style={styles.modalInput} placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input style={styles.modalInput} type="password" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input style={styles.modalInput} type="password" placeholder="Confirm Password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} />
            <button style={styles.modalPrimaryBtn} onClick={submitRegister}>Join Now</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    transition: "all 0.3s ease",
    padding: "16px 24px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--secondary)",
    letterSpacing: "-1px",
    textDecoration: "none"
  },
  links: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  link: {
    color: "var(--text-dim)",
    fontSize: "15px",
    fontWeight: "600",
    transition: "color 0.2s",
    textDecoration: "none"
  },
  activeLink: {
    color: "var(--primary)",
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none"
  },
  adminBtn: {
    background: "var(--primary-light)",
    color: "var(--primary)",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
  },
  authBtns: { display: "flex", gap: "16px", alignItems: "center" },
  loginBtn: { background: "transparent", color: "var(--text-main)", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "15px" },
  registerBtn: { background: "var(--primary)", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: "var(--shadow)" },
  userSection: { display: "flex", gap: "16px", alignItems: "center" },
  userLink: { textDecoration: "none", display: "flex", alignItems: "center" },
  userName: { color: "var(--text-main)", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
  logoutBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000, backdropFilter: "blur(4px)" },
  modal: { width: "100%", maxWidth: "400px", background: "white", borderRadius: "24px", padding: "40px", boxShadow: "var(--shadow-lg)" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" },
  closeBtn: { border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", color: "var(--text-dim)" },
  modalInput: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "16px", outline: "none", background: "#f8fafc", color: "var(--text-main)", fontSize: "15px" },
  modalPrimaryBtn: { width: "100%", background: "var(--primary)", color: "white", padding: "14px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "16px", marginTop: "8px" },
  socialRow: { display: "flex", justifyContent: "center", gap: "16px", marginTop: "32px" },
  socialBtn: { width: "56px", height: "56px", borderRadius: "16px", border: "1px solid var(--border)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
};

