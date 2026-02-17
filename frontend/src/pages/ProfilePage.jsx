import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FaUserCircle, FaBookOpen, FaCalendarCheck, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            fetchReservations(token);
        } else {
            window.location.href = "/";
        }
    }, []);

    const fetchReservations = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/api/reservations/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(res.data);
        } catch (err) {
            console.error("Error fetching reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Layout>
            <div style={styles.page}>
                <div style={styles.container}>
                    {/* PROFILE HEADER */}
                    <header style={styles.profileCard}>
                        <div style={styles.pInfo}>
                            <FaUserCircle size={80} color="var(--primary)" />
                            <div>
                                <h1 style={styles.pName}>{user.name}</h1>
                                <p style={styles.pEmail}>{user.email}</p>
                                <div style={styles.badgeRow}>
                                    <span style={styles.roleBadge}>{user.role.toUpperCase()}</span>
                                    {user.whatsapp && <span style={styles.infoBadge}>WA: {user.whatsapp}</span>}
                                    {user.contactNumber && <span style={styles.infoBadge}>TEL: {user.contactNumber}</span>}
                                    {user.address && <span style={styles.infoBadge}>ADDR: {user.address}</span>}
                                </div>
                            </div>
                        </div>
                        {user.idImage && (
                            <div style={styles.idPreview}>
                                <p style={styles.idLabel}>Verified ID Image:</p>
                                <img src={`${API_URL}${user.idImage}`} alt="User ID" style={styles.idImg} />
                            </div>
                        )}
                    </header>

                    {/* RESERVATIONS SECTION */}
                    <div style={styles.section}>
                        <h2 style={styles.secTitle}><FaBookOpen /> Your Reservations</h2>

                        {loading ? (
                            <p>Loading your stays...</p>
                        ) : reservations.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p>You haven't made any reservations yet.</p>
                                <button onClick={() => window.location.href = "/"} style={styles.bookNowBtn}>Explore Rooms</button>
                            </div>
                        ) : (
                            <div style={styles.resGrid}>
                                {reservations.map(res => (
                                    <div key={res._id} style={styles.resCard}>
                                        <div style={styles.resImg} className="res-img-hover">
                                            <img src={res.room?.image} alt={res.room?.name} style={styles.img} />
                                            <div style={styles.resStatus}>{res.status}</div>
                                        </div>
                                        <div style={styles.resBody}>
                                            <h3 style={styles.roomName}>{res.room?.name}</h3>
                                            <div style={styles.resDetail}>
                                                <FaCalendarCheck color="#64748b" />
                                                <span>{new Date(res.checkIn).toLocaleDateString()} - {new Date(res.checkOut).toLocaleDateString()}</span>
                                            </div>
                                            <div style={styles.resDetail}>
                                                <FaCreditCard color="#64748b" />
                                                <span>LKR {res.price.toLocaleString()} via {res.paymentMethod}</span>
                                            </div>
                                            <div style={styles.resNumber}>ID: {res.reservationNumber}</div>
                                            <button
                                                onClick={() => window.location.href = `/success/${res._id}`}
                                                style={styles.viewInvoice}
                                            >
                                                View Invoice
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    page: { background: "#f8fafc", minHeight: "100vh", padding: "60px 24px" },
    container: { maxWidth: "1000px", margin: "0 auto" },
    profileCard: {
        background: "white",
        padding: "40px",
        borderRadius: "32px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        marginBottom: "40px",
        border: "1px solid var(--border)"
    },
    pInfo: { display: "flex", alignItems: "center", gap: "24px" },
    pName: { fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: "-1px" },
    pEmail: { color: "var(--text-dim)", margin: "4px 0 12px 0" },
    badgeRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
    roleBadge: { background: "#f1f5f9", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", color: "var(--primary)" },
    infoBadge: { background: "var(--primary-light)", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", color: "var(--primary)" },

    idPreview: { marginTop: "32px", borderTop: "1px dashed var(--border)", paddingTop: "24px" },
    idLabel: { fontSize: "12px", fontWeight: "800", color: "var(--text-dim)", marginBottom: "12px", textTransform: "uppercase" },
    idImg: { maxWidth: "300px", borderRadius: "16px", border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },

    section: { marginTop: "40px" },
    secTitle: { fontSize: "24px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },

    resGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
    resCard: { background: "white", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
    resImg: { height: "180px", position: "relative" },
    img: { width: "100%", height: "100%", objectFit: "cover" },
    resStatus: { position: "absolute", top: "12px", right: "12px", background: "white", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", color: "var(--primary)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },

    resBody: { padding: "20px" },
    roomName: { margin: "0 0 12px 0", fontSize: "18px", fontWeight: "800" },
    resDetail: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", marginBottom: "8px" },
    resNumber: { fontSize: "11px", color: "var(--text-dim)", marginTop: "12px" },

    viewInvoice: { width: "100%", marginTop: "16px", padding: "12px", borderRadius: "12px", border: "1px solid var(--primary)", background: "transparent", color: "var(--primary)", fontWeight: "800", cursor: "pointer", transition: "0.2s" },

    emptyState: { textAlign: "center", padding: "60px", background: "white", borderRadius: "24px", border: "1px dashed var(--border)" },
    bookNowBtn: { marginTop: "20px", padding: "12px 32px", borderRadius: "14px", border: "none", background: "var(--primary)", color: "white", fontWeight: "800", cursor: "pointer" }
};
