import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaWifi, FaCoffee, FaTv, FaVolumeMute, FaCheck, FaStar } from "react-icons/fa";
import Layout from "../components/Layout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AvailableRooms() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => ({
    checkIn: params.get("checkIn") || "",
    checkOut: params.get("checkOut") || "",
    guests: params.get("guests") || "2",
    roomType: params.get("roomType") || "",
  }), [params]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/rooms/available`, { params: query });
        setRooms(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [query]);

  const reserve = (room) => {
    navigate(`/rooms/${(room._id || room.id)}`);
  };

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Your search</h3>
              <div style={styles.searchSummary}>
                <div style={styles.sumItem}><strong>In:</strong> {query.checkIn || "Date TBD"}</div>
                <div style={styles.sumItem}><strong>Out:</strong> {query.checkOut || "Date TBD"}</div>
                <div style={styles.sumItem}><strong>Guests:</strong> {query.guests} Guests</div>
              </div>
              <button onClick={() => navigate("/")} style={styles.editBtn}>Edit Search</button>
            </div>

            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Filter by:</h3>
              <div style={styles.filterGroup}>
                <h4 style={styles.filterName}>Price Range</h4>
                <div style={styles.checkItem}><input type="checkbox" /> LKR 20,000 - 40,000</div>
                <div style={styles.checkItem}><input type="checkbox" /> LKR 40,000 - 80,000</div>
                <div style={styles.checkItem}><input type="checkbox" /> LKR 80,000+</div>
              </div>
              <div style={styles.filterGroup}>
                <h4 style={styles.filterName}>Room Type</h4>
                {["Standard", "Deluxe", "Suite", "Presidential"].map(t => (
                  <div key={t} style={styles.checkItem}><input type="checkbox" /> {t}</div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main style={styles.main}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.title}>{rooms.length} matching rooms found</h2>
              <div style={styles.sortBar}>
                <span>Sort by:</span>
                <button style={styles.sortBtnActive}>Top Picks</button>
                <button style={styles.sortBtn}>Price</button>
                <button style={styles.sortBtn}>Rating</button>
              </div>
            </div>

            {loading ? (
              <div style={styles.center}><div style={styles.spinner}></div></div>
            ) : rooms.length === 0 ? (
              <div style={styles.center}>
                <p style={styles.noRooms}>No rooms found for your criteria.</p>
                <button onClick={() => navigate("/")} style={styles.primaryBtn}>Search Again</button>
              </div>
            ) : (
              <div style={styles.list}>
                {rooms.map((r) => (
                  <div key={(r._id || r.id)} style={styles.roomRow}>
                    <div style={styles.imgBlock}>
                      <img src={r.image} alt={r.name} style={styles.roomImg} />
                      <div style={styles.tag}>Sea View</div>
                    </div>

                    <div style={styles.infoBlock}>
                      <div style={styles.infoHeader}>
                        <div>
                          <h3 style={styles.roomName}>{r.name} <span style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: "600" }}>(#{r.roomNumber})</span></h3>
                          <div style={styles.stars}>
                            {[1, 2, 3, 4, 5].map(s => <FaStar key={s} color="#febb02" size={14} />)}
                            <span style={styles.roomTypeBadge}>{r.type}</span>
                          </div>
                          <p style={styles.location}>Beachfront • 50m from shore</p>
                        </div>
                        <div style={styles.ratingBox}>
                          <div style={styles.ratingText}>
                            <div style={styles.ratingVerdict}>Excellent</div>
                            <div style={styles.reviewCount}>1,240 reviews</div>
                          </div>
                          <div style={styles.ratingScore}>9.2</div>
                        </div>
                      </div>

                      <div style={styles.detailsRow}>
                        <div style={styles.amenities}>
                          <div style={styles.amenity}><FaCheck color="#008009" /> <strong>Free cancellation</strong></div>
                          <div style={styles.amenity}><FaCheck color="#008009" /> <strong>Luxury amenities</strong></div>
                          <div style={styles.icons}>
                            <FaWifi title="Free WiFi" /> <FaCoffee title="Breakfast included" /> <FaTv title="Smart TV" />
                          </div>
                          <p style={styles.roomDesc}>{r.desc}</p>
                        </div>

                        <div style={styles.priceAction}>
                          <p style={styles.pricePeriod}>1 night, 2 adults</p>
                          <h4 style={styles.priceVal}>LKR {r.price.toLocaleString()}</h4>
                          <p style={styles.taxInfo}>Includes taxes and fees</p>
                          <button onClick={() => reserve(r)} style={styles.reserveBtn}>Reserve Now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  page: { background: "var(--bg-main)", minHeight: "100vh" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", display: "flex", gap: "24px" },
  sidebar: { width: "260px", flexShrink: 0 },
  sideCard: { background: "white", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "var(--shadow)" },
  sideTitle: { margin: "0 0 16px 0", fontSize: "16px", fontWeight: "800", color: "var(--secondary)" },
  searchSummary: { fontSize: "14px", color: "var(--text-dim)" },
  sumItem: { marginBottom: "8px" },
  editBtn: { width: "100%", padding: "10px", border: "1px solid var(--border)", color: "var(--primary)", background: "white", borderRadius: "10px", fontWeight: "700", cursor: "pointer", marginTop: "10px" },
  filterGroup: { marginBottom: "20px" },
  filterName: { fontSize: "14px", fontWeight: "800", margin: "0 0 12px 0", color: "var(--secondary)" },
  checkItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "8px", color: "var(--text-main)", fontWeight: "500" },

  main: { flex: 1 },
  resultsHeader: { marginBottom: "24px" },
  title: { fontSize: "24px", color: "var(--secondary)", margin: "0 0 16px 0", fontWeight: "900" },
  sortBar: { display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", border: "1px solid var(--border)", borderRadius: "12px", background: "white", overflow: "hidden" },
  sortBtn: { padding: "12px 20px", border: "none", background: "transparent", cursor: "pointer", fontSize: "13px", color: "var(--text-dim)", fontWeight: "600" },
  sortBtnActive: { padding: "12px 20px", border: "none", background: "var(--primary-light)", cursor: "pointer", fontSize: "13px", color: "var(--primary)", fontWeight: "800" },

  list: { display: "flex", flexDirection: "column", gap: "16px" },
  roomRow: { background: "white", border: "1px solid var(--border)", borderRadius: "20px", display: "flex", overflow: "hidden", minHeight: "260px", boxShadow: "var(--shadow)", transition: "transform 0.2s" },
  imgBlock: { width: "260px", position: "relative", flexShrink: 0 },
  roomImg: { width: "100%", height: "100%", objectFit: "cover" },
  tag: { position: "absolute", top: "12px", left: "12px", background: "white", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", color: "var(--primary)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", textTransform: "uppercase" },

  infoBlock: { flex: 1, padding: "24px", display: "flex", flexDirection: "column" },
  infoHeader: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  roomName: { margin: "0 0 4px 0", fontSize: "22px", color: "var(--secondary)", fontWeight: "800" },
  stars: { display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" },
  roomTypeBadge: { background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", marginLeft: "8px", textTransform: "uppercase" },
  location: { fontSize: "13px", color: "var(--primary)", fontWeight: "600", margin: 0 },

  ratingBox: { display: "flex", gap: "10px" },
  ratingText: { textAlign: "right" },
  ratingVerdict: { fontWeight: "800", color: "var(--secondary)", fontSize: "15px" },
  reviewCount: { fontSize: "12px", color: "var(--text-dim)" },
  ratingScore: { background: "var(--primary)", color: "white", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px 8px 8px 0", fontWeight: "800" },

  detailsRow: { display: "flex", gap: "24px", flex: 1 },
  amenities: { flex: 1, borderRight: "1px solid var(--border)", paddingRight: "24px" },
  amenity: { fontSize: "13px", color: "#059669", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" },
  icons: { display: "flex", gap: "16px", color: "var(--secondary)", margin: "16px 0", fontSize: "18px" },
  roomDesc: { fontSize: "14px", color: "var(--text-dim)", lineHeight: "1.6", margin: 0 },

  priceAction: { width: "200px", textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "flex-end" },
  pricePeriod: { fontSize: "13px", color: "var(--text-dim)", marginBottom: "4px" },
  priceVal: { fontSize: "24px", fontWeight: "900", color: "var(--secondary)", margin: "0 0 4px 0" },
  taxInfo: { fontSize: "12px", color: "var(--text-dim)", marginBottom: "16px" },
  reserveBtn: { background: "var(--primary)", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" },

  center: { textAlign: "center", padding: "80px", background: "white", borderRadius: "24px", border: "1px solid var(--border)", boxShadow: "var(--shadow)" },
  spinner: { width: "40px", height: "40px", border: "4px solid #f1f5f9", borderTop: "4px solid var(--primary)", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" },
  noRooms: { color: "var(--secondary)", fontSize: "20px", marginBottom: "24px", fontWeight: "700" },
  primaryBtn: { background: "var(--primary)", color: "white", padding: "14px 28px", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }
};

