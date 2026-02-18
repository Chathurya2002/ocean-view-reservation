import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { FaCar, FaBiking, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RentalsPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/rentals`);
                setRentals(res.data);
            } catch (err) {
                console.error("Error fetching rentals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const handleRent = (rental) => {
        const today = new Date().toISOString().split('T')[0];
        navigate(`/payment?amount=${rental.price}&rentalIds=${rental._id}&checkIn=${today}&checkOut=${today}&guests=1`);
    };

    if (loading) return <Layout><div style={styles.loader}>Loading Rentals...</div></Layout>;

    return (
        <Layout>
            <div style={styles.page}>
                <div style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>Rent a <span style={{ color: "var(--primary)" }}>Vehicle</span></h1>
                        <p style={styles.heroSub}>Explore Galle and match your freedom with our premium rental fleet.</p>
                    </div>
                </div>

                <div style={styles.container}>
                    <div style={styles.grid}>
                        {rentals.map(rental => (
                            <div key={rental._id} style={styles.card}>
                                <div style={{ ...styles.cardImg, backgroundImage: `url(${rental.image})` }}>
                                    <div style={styles.priceBadge}>LKR {rental.price.toLocaleString()}</div>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.cardHeader}>
                                        <span style={styles.catTag}>
                                            {rental.type === "Vehicle" ? <FaCar size={12} /> : <FaBiking size={12} />}
                                            {rental.type}
                                        </span>
                                    </div>
                                    <h3 style={styles.rentalName}>{rental.name}</h3>
                                    <p style={styles.rentalDesc}>{rental.description}</p>

                                    <div style={styles.featuresBox}>
                                        <ul style={styles.list}>
                                            {rental.features && rental.features.map((feature, idx) => (
                                                <li key={idx} style={styles.listItem}>• {feature}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={styles.footer}>
                                        <button onClick={() => handleRent(rental)} style={styles.rentBtn}>
                                            Rent Now <FaCheckCircle size={12} />
                                        </button>
                                        <div style={styles.note}><FaInfoCircle size={10} /> Instant Booking</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    page: { background: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" },
    loader: { height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "var(--text-dim)" },

    hero: {
        height: "350px",
        background: "linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1595304958316-24df616cf37d?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        marginBottom: "60px"
    },
    heroContent: { maxWidth: "700px", padding: "0 24px" },
    heroTitle: { fontSize: "48px", fontWeight: "900", marginBottom: "16px", letterSpacing: "-1px" },
    heroSub: { fontSize: "18px", opacity: 0.9, lineHeight: "1.6" },

    container: { maxWidth: "1200px", margin: "0 auto", padding: "0 24px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px" },

    card: { background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", transition: "transform 0.3s ease", display: "flex", flexDirection: "column" },
    cardImg: { height: "220px", backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
    priceBadge: { position: "absolute", bottom: "16px", right: "16px", background: "var(--primary)", color: "white", padding: "8px 16px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },

    cardBody: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    catTag: { fontSize: "11px", fontWeight: "800", color: "var(--primary)", background: "var(--primary-light)", padding: "4px 10px", borderRadius: "8px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" },

    rentalName: { fontSize: "20px", fontWeight: "800", color: "var(--secondary)", margin: 0 },
    rentalDesc: { fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 },

    featuresBox: { background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9", marginTop: "8px" },
    list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "8px" },
    listItem: { fontSize: "12px", color: "var(--text-dim)", fontWeight: "600", background: "white", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0" },

    footer: { marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "10px" },
    rentBtn: { background: "var(--primary)", color: "white", padding: "12px", borderRadius: "12px", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" },
    note: { fontSize: "11px", color: "#94a3b8", fontWeight: "600", fontStyle: "italic", display: "flex", alignItems: "center", gap: "4px", alignSelf: "center" }
};
