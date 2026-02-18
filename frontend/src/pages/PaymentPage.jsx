import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { FaCreditCard, FaLock, FaShieldAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract booking details from URL
    const roomId = searchParams.get("roomId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests");
    const amount = searchParams.get("amount");
    const experienceIds = searchParams.get("experienceIds") ? searchParams.get("experienceIds").split(",") : [];
    const rentalIds = searchParams.get("rentalIds") ? searchParams.get("rentalIds").split(",") : [];

    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({
        name: "",
        number: "",
        expiry: "",
        cvc: ""
    });

    useEffect(() => {
        if (!amount) {
            alert("Invalid payment session. Redirecting...");
            navigate("/");
        }
    }, [amount, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            navigate("/login");
            return;
        }

        // Simulate Payment Processing Delay
        setTimeout(async () => {
            try {
                // Create Reservation after successful payment simulation
                const res = await axios.post(`${API_URL}/api/reservations`, {
                    roomId: roomId || null,
                    checkIn: checkIn || new Date(),
                    checkOut: checkOut || new Date(),
                    guests: guests || 1,
                    paymentMethod: "CARD",
                    amount: parseFloat(amount),
                    paymentStatus: "PAID",
                    experienceIds, // Include selected experiences
                    rentalIds // Include selected rentals
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setLoading(false);
                navigate(`/success/${res.data._id}`);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || "Booking failed after payment. Please contact support.");
                setLoading(false);
            }
        }, 2000);
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        // Basic formatting
        if (name === "number") {
            value = value.replace(/\D/g, '').slice(0, 16); // Only numbers, max 16
        } else if (name === "expiry") {
            value = value.replace(/\D/g, '').slice(0, 4); // Only numbers, max 4 (MMYY)
            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
        } else if (name === "cvc") {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardData({ ...cardData, [name]: value });
    };

    return (
        <Layout>
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Secure Payment</h2>
                        <div style={styles.secureBadge}><FaShieldAlt /> 256-bit SSL Encrypted</div>
                    </div>

                    <div style={styles.summary}>
                        <div style={styles.row}><span>Total Amount</span><span style={styles.amount}>LKR {parseInt(amount || 0).toLocaleString()}</span></div>
                        <div style={styles.rowSmall}>Due Now</div>
                    </div>

                    <form onSubmit={handlePayment} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Cardholder Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="JOHN DOE"
                                required
                                style={styles.input}
                                value={cardData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Card Number</label>
                            <div style={styles.iconInput}>
                                <FaCreditCard style={styles.icon} />
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    style={{ ...styles.input, paddingLeft: "40px" }}
                                    value={cardData.number}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={styles.rowGroup}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Expiry (MM/YY)</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    required
                                    style={styles.input}
                                    value={cardData.expiry}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>CVC</label>
                                <input
                                    type="password"
                                    name="cvc"
                                    placeholder="123"
                                    required
                                    style={styles.input}
                                    value={cardData.cvc}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={loading ? styles.payBtnDisabled : styles.payBtn}>
                            {loading ? "Processing..." : `Pay LKR ${parseInt(amount).toLocaleString()}`} <FaLock size={12} />
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <p>Payment processed securely. We not store your card details.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    container: {
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "40px 20px"
    },
    card: {
        background: "white",
        maxWidth: "480px",
        width: "100%",
        borderRadius: "24px",
        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.1)",
        padding: "40px",
        border: "1px solid #e2e8f0"
    },
    header: { marginBottom: "32px", textAlign: "center" },
    title: { fontSize: "24px", fontWeight: "900", color: "var(--secondary)", marginBottom: "8px" },
    secureBadge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "#ecfdf5", color: "#059669", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700" },

    summary: { background: "#f1f5f9", padding: "20px", borderRadius: "16px", marginBottom: "32px" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "700", color: "#64748b" },
    rowSmall: { fontSize: "12px", color: "#94a3b8", textAlign: "right", marginTop: "4px" },
    amount: { fontSize: "20px", fontWeight: "900", color: "var(--secondary)" },

    form: { display: "flex", flexDirection: "column", gap: "20px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
    rowGroup: { display: "flex", gap: "20px" },
    label: { fontSize: "12px", fontWeight: "800", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", fontSize: "16px", fontWeight: "600", color: "var(--secondary)", outline: "none", transition: "border 0.2s" },
    iconInput: { position: "relative" },
    icon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },

    payBtn: { background: "var(--primary)", color: "white", padding: "18px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px", boxShadow: "0 10px 20px -5px var(--primary-light)" },
    payBtnDisabled: { background: "#94a3b8", color: "white", padding: "18px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: "800", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px" },

    footer: { marginTop: "24px", textAlign: "center", fontSize: "12px", color: "#cbd5e1", lineHeight: "1.5" }
};
