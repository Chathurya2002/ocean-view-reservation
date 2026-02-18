import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FaClock, FaTag, FaInfoCircle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/experiences`);
                setExperiences(res.data);
            } catch (err) {
                console.error("Error fetching experiences:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    if (loading) return <Layout><div style={styles.loader}>Exploring local wonders...</div></Layout>;

    return (
        <Layout>
            <div style={styles.page}>
                <div style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>Extra <span style={{ color: "var(--primary)" }}>Trips</span> & Activities</h1>
                        <p style={styles.heroSub}>Discover the magic of Galle and Hikkaduwa with our curated local experiences.</p>
                    </div>
                </div>

                <div style={styles.container}>
                    <div style={styles.grid}>
                        {experiences.map(exp => (
                            <div key={exp._id} style={styles.card}>
                                <div style={{ ...styles.cardImg, backgroundImage: `url(${exp.image})` }}>
                                    <div style={styles.priceBadge}>LKR {exp.price.toLocaleString()}</div>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.cardHeader}>
                                        <span style={styles.catTag}><FaTag size={10} /> {exp.category}</span>
                                        <span style={styles.duration}><FaClock size={10} /> {exp.duration}</span>
                                    </div>
                                    <h3 style={styles.expName}>{exp.name}</h3>
                                    <p style={styles.expDesc}>{exp.desc}</p>

                                    <div style={styles.includesBox}>
                                        <h4 style={styles.includesTitle}>What's included:</h4>
                                        <ul style={styles.list}>
                                            {exp.includes.slice(0, 3).map((item, idx) => (
                                                <li key={idx} style={styles.listItem}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={styles.footer}>
                                        <div style={styles.note}><FaInfoCircle size={10} /> {exp.notes}</div>
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
        height: "400px",
        background: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://www.andbeyond.com/wp-content/uploads/sites/5/Fortress-Resort-Galle-Locals-Fishing-and-Balancing-On-Sticks-In-the-Sea.jpg')",
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
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "32px" },

    card: { background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", transition: "transform 0.3s ease" },
    cardImg: { height: "240px", backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
    priceBadge: { position: "absolute", bottom: "16px", right: "16px", background: "var(--primary)", color: "white", padding: "8px 16px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },

    cardBody: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    catTag: { fontSize: "11px", fontWeight: "800", color: "var(--primary)", background: "var(--primary-light)", padding: "4px 10px", borderRadius: "8px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" },
    duration: { fontSize: "12px", color: "var(--text-dim)", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" },

    expName: { fontSize: "20px", fontWeight: "800", color: "var(--secondary)", margin: 0 },
    expDesc: { fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 },

    includesBox: { background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" },
    includesTitle: { fontSize: "12px", fontWeight: "800", color: "var(--secondary)", marginBottom: "8px", textTransform: "uppercase" },
    list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" },
    listItem: { fontSize: "13px", color: "var(--text-dim)", fontWeight: "600" },

    footer: { marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "16px" },
    note: { fontSize: "11px", color: "#94a3b8", fontWeight: "600", fontStyle: "italic", display: "flex", alignItems: "center", gap: "4px" }
};
