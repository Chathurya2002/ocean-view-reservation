import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { FaCalendarAlt, FaUser, FaBed, FaSearch, FaArrowRight } from "react-icons/fa";

const ROOMS = [
  {
    id: "STANDARD",
    name: "Standard Coastal",
    desc: "Cozy rooms perfectly suited for those who appreciate the sound of waves.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "DELUXE",
    name: "Ocean Deluxe",
    desc: "Spacious deluxe rooms with a private balcony overlooking the deep blue.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f244?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "SUITE",
    name: "Family Suite",
    desc: "Two-bedroom suites designed for families seeking luxury and connection.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "PRESIDENTIAL",
    name: "Royal Presidential",
    desc: "The pinnacle of our resort. Unmatched views and bespoke service.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=60"
  }
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    roomType: "STANDARD",
    guests: "2"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = () => {
    if (!form.checkInDate || !form.checkOutDate) {
      return alert("📅 Please select both check-in and check-out dates to continue.");
    }
    navigate(`/rooms?checkIn=${form.checkInDate}&checkOut=${form.checkOutDate}&roomType=${form.roomType}&guests=${form.guests}`);
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>✨ The Ultimate Escape</div>
          <h1 style={styles.heroTitle}>Refining <span style={styles.highlight}>Summer</span> Luxury</h1>
          <p style={styles.heroSub}>
            Book your stay at Ocean View and discover a new dimension of coastal tranquility.
          </p>

          <div style={styles.searchContainer}>
            <div style={styles.searchBox}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><FaCalendarAlt /> Check-in</label>
                <input name="checkInDate" type="date" value={form.checkInDate} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.divider} />
              <div style={styles.inputGroup}>
                <label style={styles.label}><FaCalendarAlt /> Check-out</label>
                <input name="checkOutDate" type="date" value={form.checkOutDate} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.divider} />
              <div style={styles.inputGroup}>
                <label style={styles.label}><FaUser /> Guests</label>
                <select name="guests" value={form.guests} onChange={handleChange} style={styles.select}>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
              <div style={styles.divider} />
              <div style={styles.inputGroup}>
                <label style={styles.label}><FaBed /> Category</label>
                <select name="roomType" value={form.roomType} onChange={handleChange} style={styles.select}>
                  <option value="STANDARD">Standard</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="SUITE">Suite</option>
                  <option value="PRESIDENTIAL">Presidential</option>
                </select>
              </div>
              <button onClick={handleSearch} style={styles.searchBtn}>
                <FaSearch /> Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROOM CATEGORIES */}
      <section style={styles.section}>
        <div style={styles.header}>
          <h2 style={styles.title}>Refined Accommodations</h2>
          <p style={styles.sub}>Carefully designed spaces to ensure your absolute comfort.</p>
        </div>

        <div style={styles.grid}>
          {ROOMS.map((room) => (
            <div
              key={room.id}
              style={styles.card}
              onClick={() => navigate(`/rooms?roomType=${room.id}`)}
              onMouseEnter={(e) => {
                // Image
                const img = e.currentTarget.querySelector('.card-img');
                if (img) {
                  img.style.filter = "grayscale(0%)";
                  img.style.transform = "scale(1.05)";
                }
                // Desc
                const desc = e.currentTarget.querySelector('.card-desc');
                if (desc) {
                  desc.style.opacity = "1";
                  desc.style.transform = "translateY(0)";
                  desc.style.height = "auto";
                }
              }}
              onMouseLeave={(e) => {
                // Image
                const img = e.currentTarget.querySelector('.card-img');
                if (img) {
                  img.style.filter = "grayscale(100%)";
                  img.style.transform = "scale(1)";
                }
                // Desc
                const desc = e.currentTarget.querySelector('.card-desc');
                if (desc) {
                  desc.style.opacity = "0";
                  desc.style.transform = "translateY(20px)";
                  desc.style.height = "0";
                }
              }}
            >
              <div
                className="card-img"
                style={{ ...styles.cardImg, backgroundImage: `url(${room.image})` }}
              />

              <div style={styles.imageOverlay}>
                <h3 style={styles.cardName}>{room.name}</h3>
                <p className="card-desc" style={styles.cardDesc}>{room.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Lightbox */}
      {selectedImage && (
        <div style={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <button style={styles.closeBtn} onClick={() => setSelectedImage(null)}>✕</button>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.url} alt={selectedImage.name} style={styles.lightboxImg} />
            <p style={styles.lightboxCaption}>{selectedImage.name}</p>
          </div>
        </div>
      )}

      {/* FEATURES SECTION */}
      <section style={styles.features}>
        <div style={styles.featContent}>
          <div style={styles.featItem}>
            <div style={styles.featIcon}>🌊</div>
            <h4>Private Beach</h4>
            <p>Access to over 2km of pristine, private white sand beach.</p>
          </div>
          <div style={styles.featItem}>
            <div style={styles.featIcon}>🍽️</div>
            <h4>Fine Dining</h4>
            <p>Five world-class restaurants featuring global cuisines.</p>
          </div>
          <div style={styles.featItem}>
            <div style={styles.featIcon}>💆</div>
            <h4>Royal Spa</h4>
            <p>Award-winning wellness treatments by the ocean.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const styles = {
  hero: {
    minHeight: "85vh",
    background: "linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url(https://d3prz3jkfh1dmo.cloudfront.net/sites/4/2025/10/kk-beach-new-desk-banner-3.jpg?w=1920&h=800)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 24px",
    position: "relative"
  },
  heroContent: { maxWidth: "1000px", width: "100%", zIndex: 2 },
  badge: { display: "inline-block", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", padding: "8px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", color: "white", border: "1px solid rgba(255,255,255,0.3)", marginBottom: "24px", letterSpacing: "1px" },
  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 5.5rem)",
    fontWeight: "900",
    color: "white",
    letterSpacing: "-2px",
    lineHeight: "1.1",
    marginBottom: "24px",
    textShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },
  highlight: { color: "#38bdf8", position: "relative" },
  heroSub: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.9)",
    maxWidth: "600px",
    margin: "0 auto 60px",
    lineHeight: "1.6",
    textShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },

  searchContainer: { display: "flex", justifyContent: "center" },
  searchBox: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    padding: "12px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.5)",
    maxWidth: "950px",
    width: "100%",
    gap: "0"
  },
  inputGroup: {
    flex: 1,
    padding: "12px 24px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    transition: "background 0.2s",
    borderRadius: "16px"
  },
  divider: { width: "1px", height: "40px", background: "#cbd5e1" },
  label: { fontSize: "11px", fontWeight: "800", color: "#64748b", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", border: "none", background: "transparent", fontSize: "15px", fontWeight: "700", color: "#1e293b", outline: "none", padding: "0" },
  select: { width: "100%", border: "none", background: "transparent", fontSize: "15px", fontWeight: "700", color: "#1e293b", outline: "none", padding: "0", cursor: "pointer" },

  searchBtn: {
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    color: "white",
    padding: "20px 36px",
    border: "none",
    borderRadius: "20px",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.4)",
    transition: "all 0.2s",
    marginLeft: "12px"
  },

  section: { padding: "100px 24px", maxWidth: "1280px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "60px" },
  title: { fontSize: "3rem", marginBottom: "16px", fontWeight: "800", letterSpacing: "-1px", color: "#0f172a" },
  sub: { color: "#64748b", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  card: {
    position: "relative",
    height: "450px",
    borderRadius: "4px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
  },

  cardImg: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "filter 0.4s ease, transform 0.6s ease",
    filter: "grayscale(100%)"
  },

  // Overlay always present for text readability, steeper gradient
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "32px 24px",
    transition: "all 0.3s ease"
  },

  // Text Styles
  cardName: {
    fontSize: "22px",
    marginBottom: "8px",
    color: "white",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)"
  },
  cardDesc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "13px",
    lineHeight: "1.5",
    textAlign: "center",
    maxWidth: "100%",
    opacity: 0, // Hidden by default, shown on hover
    transform: "translateY(20px)",
    transition: "all 0.3s ease",
    height: "0",
    overflow: "hidden"
  },

  features: { padding: "80px 24px", background: "#0f172a", color: "white" },
  featContent: { maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", textAlign: "center" },
  featItem: { padding: "24px" },
  featIcon: { fontSize: "40px", marginBottom: "20px", display: "inline-block", background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "24px" },

  lightbox: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
  closeBtn: { position: "absolute", top: "24px", right: "24px", background: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer", zIndex: 2001 },
  lightboxContent: { position: "relative", maxWidth: "1000px", width: "100%" },
  lightboxImg: { width: "100%", borderRadius: "12px", display: "block" },
  lightboxCaption: { position: "absolute", bottom: "-40px", left: 0, width: "100%", textAlign: "center", color: "white", fontSize: "16px", fontWeight: "600" }
};
