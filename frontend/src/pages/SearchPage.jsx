import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { FaCalendarAlt, FaUser, FaBed, FaSearch, FaArrowRight, FaGift, FaTimes } from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const [activeOffers, setActiveOffers] = useState([]);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    // Fetch active offers
    axios.get(`${API_URL}/api/offers/active`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setActiveOffers(res.data);
        }
      })
      .catch(err => console.error("Error fetching offers", err));
  }, []);

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

      {/* FLOATING OFFERS BUTTON */}
      {activeOffers.length > 0 && (
        <button
          style={styles.floatingOfferBtn}
          onClick={() => setShowOfferPopup(true)}
          className="offer-float-btn"
        >
          <div style={styles.offerPulse}></div>
          <FaGift size={24} />
        </button>
      )}

      {/* OFFERS POPUP MODAL */}
      {showOfferPopup && activeOffers.length > 0 && (
        <div style={styles.offerOverlay} onClick={() => setShowOfferPopup(false)}>
          <div style={styles.offerModal} onClick={e => e.stopPropagation()}>
            <button style={styles.offerClose} onClick={() => setShowOfferPopup(false)}>
              <FaTimes />
            </button>
            <div style={styles.offerContent}>
              <div style={styles.offerIconWrapper}>
                <FaGift size={32} color="var(--primary)" />
              </div>
              <h2 style={styles.offerTitle}>{activeOffers[currentOfferIndex].title}</h2>
              <p style={styles.offerDesc}>{activeOffers[currentOfferIndex].description}</p>

              {activeOffers[currentOfferIndex].discountCode && (
                <div style={styles.offerCodeBox}>
                  Use Code: <strong>{activeOffers[currentOfferIndex].discountCode}</strong>
                </div>
              )}

              {activeOffers.length > 1 && (
                <div style={styles.offerPagination}>
                  <button
                    style={styles.offerNavBtn}
                    onClick={() => setCurrentOfferIndex(prev => prev === 0 ? activeOffers.length - 1 : prev - 1)}
                  >
                    Prev Offer
                  </button>
                  <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                    {currentOfferIndex + 1} / {activeOffers.length}
                  </span>
                  <button
                    style={styles.offerNavBtn}
                    onClick={() => setCurrentOfferIndex(prev => prev === activeOffers.length - 1 ? 0 : prev + 1)}
                  >
                    Next Offer
                  </button>
                </div>
              )}

            </div>
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
    minHeight: "90vh",
    background: "linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.7)), url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop)",
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
  heroTitle: {
    fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
    fontWeight: "900",
    color: "white",
    letterSpacing: "-2.5px",
    lineHeight: "1.05",
    marginBottom: "24px",
    textShadow: "0 15px 40px rgba(0,0,0,0.4)"
  },
  // using a gentle gold/amber highlight for a more premium resort feel
  highlight: {
    background: "linear-gradient(to right, #fbbf24, #f59e0b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative"
  },
  heroSub: {
    fontSize: "1.25rem",
    color: "rgba(255, 255, 255, 0.85)",
    maxWidth: "650px",
    margin: "0 auto 60px",
    lineHeight: "1.6",
    textShadow: "0 4px 10px rgba(0,0,0,0.5)",
    fontWeight: "400"
  },

  searchContainer: { display: "flex", justifyContent: "center" },
  searchBox: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "12px",
    borderRadius: "28px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.2)",
    maxWidth: "950px",
    width: "100%",
    gap: "0"
  },
  // We use dark text for the inputs because the glass is light/transparent, so white text might blend in if the background is bright. I'll make the inputs use white text to match the dark hero overlay.
  inputGroup: {
    flex: 1,
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    transition: "background 0.3s ease",
    borderRadius: "20px",
    cursor: "pointer"
  },
  divider: { width: "1px", height: "50px", background: "rgba(255,255,255,0.2)" },
  label: { fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" },
  input: { width: "100%", border: "none", background: "transparent", fontSize: "16px", fontWeight: "700", color: "#ffffff", outline: "none", padding: "0" },
  select: { width: "100%", border: "none", background: "transparent", fontSize: "16px", fontWeight: "700", color: "#ffffff", outline: "none", padding: "0", cursor: "pointer" },

  searchBtn: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "white",
    padding: "24px 40px",
    border: "none",
    borderRadius: "20px",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.5)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginLeft: "12px"
  },

  section: { padding: "120px 24px", maxWidth: "1280px", margin: "0 auto", background: "var(--bg-main)", transition: "background 0.3s ease" },
  header: { textAlign: "center", marginBottom: "80px" },
  title: { fontSize: "3.5rem", marginBottom: "16px", fontWeight: "900", letterSpacing: "-1.5px", color: "var(--text-main)" },
  sub: { color: "var(--text-dim)", fontSize: "1.25rem", maxWidth: "650px", margin: "0 auto", lineHeight: "1.6" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1280px",
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

  features: { padding: "100px 24px", background: "var(--bg-card)", color: "var(--text-main)", borderTop: "1px solid var(--border)", transition: "background 0.3s ease, border 0.3s ease" },
  featContent: { maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", textAlign: "center" },
  featItem: { padding: "32px", background: "var(--bg-main)", borderRadius: "24px", border: "1px solid var(--border)", boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)", transition: "transform 0.3s ease" },
  featIcon: { fontSize: "40px", marginBottom: "24px", display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "20px", borderRadius: "24px" },

  lightbox: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
  closeBtn: { position: "absolute", top: "24px", right: "24px", background: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "20px", cursor: "pointer", zIndex: 2001 },
  lightboxContent: { position: "relative", maxWidth: "1000px", width: "100%" },
  lightboxImg: { width: "100%", borderRadius: "12px", display: "block", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" },
  lightboxCaption: { position: "absolute", bottom: "-40px", left: 0, width: "100%", textAlign: "center", color: "white", fontSize: "16px", fontWeight: "600", letterSpacing: "1px" },

  // OFFERS FLOATING BUTTON STYLES
  floatingOfferBtn: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "var(--secondary)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    boxShadow: "0 10px 25px rgba(234, 179, 8, 0.4)",
    cursor: "pointer",
    zIndex: 999,
    transition: "all 0.3s ease",
  },
  offerPulse: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "var(--secondary)",
    opacity: 0.5,
    animation: "pulse 2s infinite",
    zIndex: -1,
  },
  offerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  offerModal: {
    backgroundColor: "var(--bg-main)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
    position: "relative",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    textAlign: "center",
    animation: "slideUp 0.4s ease-out",
  },
  offerClose: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "transparent",
    border: "none",
    color: "var(--text-dim)",
    fontSize: "18px",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  offerIconWrapper: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "rgba(212, 175, 55, 0.1)", // Light primary tint
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
  },
  offerTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--text-main)",
    marginBottom: "12px",
  },
  offerDesc: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "var(--text-dim)",
    marginBottom: "24px",
  },
  offerCodeBox: {
    backgroundColor: "var(--bg-card)",
    border: "2px dashed var(--primary)",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    color: "var(--text-main)",
    display: "inline-block",
    marginBottom: "20px",
  },
  offerPagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
    borderTop: "1px solid var(--border)",
    paddingTop: "15px",
  },
  offerNavBtn: {
    background: "transparent",
    border: "none",
    color: "var(--primary)",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  }
};

// Add keyframes for animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.4); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .offer-float-btn:hover {
    transform: scale(1.1) rotate(5deg);
  }
`;
document.head.appendChild(styleSheet);
