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
            <div key={room.id} style={styles.card}>
              <div
                style={{ ...styles.cardImg, backgroundImage: `url(${room.image})` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage({ url: room.image, name: room.name });
                }}
              >
                <div style={styles.imageOverlay}>
                  <span style={styles.zoomIcon}>🔍 Click to Enlarge</span>
                </div>
              </div>
              <div style={styles.cardBody} onClick={() => navigate(`/rooms?roomType=${room.id}`)}>
                <h3 style={styles.cardName}>{room.name}</h3>
                <p style={styles.cardDesc}>{room.desc}</p>
                <button style={styles.viewDetailsBtn}>View Details <FaArrowRight size={10} /></button>
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
    background: "linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url(https://d3prz3jkfh1dmo.cloudfront.net/sites/4/2025/10/kk-beach-new-desk-banner-3.jpg?w=1920&h=800)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 24px"
  },
  heroContent: { maxWidth: "1000px", width: "100%" },
  badge: { display: "inline-block", background: "white", padding: "8px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "800", color: "var(--primary)", boxShadow: "0 4px 12px rgba(44, 43, 43, 0.05)", marginBottom: "24px" },
  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 5rem)",
    fontWeight: "900",
    color: "white",
    letterSpacing: "-2px",
    lineHeight: "1.1",
    marginBottom: "24px",
    textShadow: "0 4px 12px rgba(0,0,0,0.3)"
  },
  highlight: { color: "#60a5fa", position: "relative" },
  heroSub: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.95)",
    maxWidth: "550px",
    margin: "0 auto 60px",
    lineHeight: "1.6",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)"
  },

  searchContainer: { display: "flex", justifyContent: "center" },
  searchBox: {
    background: "white",
    padding: "10px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 20px 50px -12px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)",
    maxWidth: "900px",
    width: "100%",
    gap: "0"
  },
  inputGroup: {
    flex: 1,
    padding: "10px 20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  divider: { width: "1px", height: "40px", background: "#e2e8f0" },
  label: { fontSize: "11px", fontWeight: "800", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { width: "100%", border: "none", background: "transparent", fontSize: "14px", fontWeight: "700", color: "var(--secondary)", outline: "none", padding: "4px 0" },
  select: { width: "100%", border: "none", background: "transparent", fontSize: "14px", fontWeight: "700", color: "var(--secondary)", outline: "none", padding: "4px 0", cursor: "pointer" },

  searchBtn: {
    background: "var(--primary)",
    color: "white",
    padding: "18px 32px",
    border: "none",
    borderRadius: "18px",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 10px 20px -5px var(--primary-light)",
    transition: "transform 0.2s",
    marginLeft: "10px"
  },

  section: { padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "2.5rem", marginBottom: "12px", fontWeight: "800", letterSpacing: "-1px" },
  sub: { color: "var(--text-dim)", fontSize: "1.1rem" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px"
  },
  card: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    cursor: "pointer",
    textAlign: "left"
  },
  viewBtn: { background: "white", color: "var(--secondary)", padding: "8px 16px", borderRadius: "100px", border: "none", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" },
  cardBody: { padding: "20px" },
  cardName: { fontSize: "16px", marginBottom: "6px", color: "var(--secondary)", fontWeight: "800" },
  cardDesc: { color: "var(--text-dim)", fontSize: "12px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" },

  features: { padding: "60px 24px", background: "var(--secondary)", color: "white" },
  featContent: { maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap" },
  featItem: { textAlign: "center", maxWidth: "250px" },
  featIcon: { fontSize: "32px", marginBottom: "16px" },
};
