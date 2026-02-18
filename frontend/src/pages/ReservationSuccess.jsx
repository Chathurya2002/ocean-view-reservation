import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import Layout from "../components/Layout";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { FaCheckCircle, FaDownload, FaHome } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReservationSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchReservation = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            try {
                // Since our backend endpoint is /:id, we can fetch directly
                const res = await axios.get(`${API_URL}/api/reservations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReservation(res.data);
            } catch (err) {
                console.error(err);
                alert("Could not load reservation details.");
            } finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [id, navigate]);

    const handleDownloadPdf = async () => {
        const element = invoiceRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ocean-view-invoice-${reservation.reservationNumber}.pdf`);
    };

    if (loading) return <Layout><div style={{ textAlign: "center", padding: "100px" }}>Loading Receipt...</div></Layout>;
    if (!reservation) return null;

    const { room, checkIn, checkOut, reservationNumber, paymentMethod, price, experiences, rentals } = reservation;

    // Calculate nights only if room exists
    const nightCount = room ? Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;

    // Calculate totals for display
    const roomTotal = room ? nightCount * room.price : 0;
    const expTotal = experiences ? experiences.reduce((sum, item) => sum + (item.experience?.price || 0), 0) : 0;
    const rentalTotal = rentals ? rentals.reduce((sum, item) => sum + ((item.rental?.price || 0) * (item.days || 1)), 0) : 0;
    const calculatedTotal = roomTotal + expTotal + rentalTotal;

    return (
        <Layout>
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.successIcon}><FaCheckCircle /></div>
                    <h1 style={styles.title}>Booking Confirmed!</h1>
                    <p style={styles.sub}>Thank you for choosing Ocean View. We can't wait to host you.</p>

                    {/* INVOICE TEMPLATE */}
                    <InvoiceTemplate ref={invoiceRef} reservation={reservation} />

                    <div style={styles.actions}>
                        <button onClick={handleDownloadPdf} style={styles.downloadBtn}>
                            <FaDownload /> Download Receipt
                        </button>
                        <button onClick={() => navigate("/")} style={styles.homeBtn}>
                            <FaHome /> Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    container: { background: "#f8fafc", minHeight: "100vh", padding: "40px 20px", display: "flex", justifyContent: "center" },
    content: { maxWidth: "600px", width: "100%", textAlign: "center" },
    successIcon: { fontSize: "60px", color: "#10b981", marginBottom: "20px" },
    title: { fontSize: "32px", fontWeight: "900", color: "var(--secondary)", marginBottom: "8px" },
    sub: { color: "var(--text-dim)", marginBottom: "40px" },

    invoice: { background: "white", padding: "40px", borderRadius: "0", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", textAlign: "left", marginBottom: "30px" },
    invHeader: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" },
    brand: { color: "var(--primary)", fontSize: "24px", fontWeight: "900" },
    invMeta: { textAlign: "right", fontSize: "12px", color: "var(--text-dim)", lineHeight: "1.6" },

    divider: { height: "2px", background: "#f1f5f9", margin: "20px 0" },

    guestInfo: { marginBottom: "30px", fontSize: "14px", lineHeight: "1.6", color: "var(--secondary)" },

    table: { marginBottom: "30px" },
    tHead: { display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#94a3b8", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", marginBottom: "16px" },
    tRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--secondary)", fontWeight: "600" },
    sm: { fontSize: "12px", color: "var(--text-dim)", fontWeight: "400", marginTop: "4px" },

    totalSection: { background: "#f8fafc", padding: "20px", borderRadius: "12px" },
    totalRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "700", color: "var(--secondary)", marginBottom: "8px" },

    footer: { marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#cbd5e1" },

    actions: { display: "flex", gap: "16px", justifyContent: "center" },
    downloadBtn: { background: "var(--secondary)", color: "white", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
    homeBtn: { background: "transparent", color: "var(--text-dim)", padding: "12px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }
};
