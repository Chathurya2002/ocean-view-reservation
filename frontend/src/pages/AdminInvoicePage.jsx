import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { FaDownload, FaArrowLeft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminInvoicePage() {
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
                const res = await axios.get(`${API_URL}/api/reservations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReservation(res.data);
            } catch (err) {
                console.error(err);
                alert("Could not load reservation.");
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
        pdf.save(`invoice-${reservation.reservationNumber}.pdf`);
    };

    if (loading) return <div style={styles.loader}>Loading Invoice...</div>;
    if (!reservation) return <div style={styles.loader}>Invoice Not Found</div>;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}><FaArrowLeft /> Back</button>
                <div style={styles.actions}>
                    <button onClick={handleDownloadPdf} style={styles.downloadBtn}><FaDownload /> Download PDF</button>
                    <button onClick={() => window.print()} style={styles.printBtn}>Print</button>
                </div>
            </div>

            <div style={styles.invoiceWrapper}>
                <InvoiceTemplate ref={invoiceRef} reservation={reservation} />
            </div>
        </div>
    );
}

const styles = {
    page: { background: "#e2e8f0", minHeight: "100vh", padding: "40px 20px" },
    loader: { display: "flex", justifyContent: "center", marginTop: "100px", fontSize: "18px", fontWeight: "700", color: "#64748b" },
    header: { maxWidth: "800px", margin: "0 auto 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },

    backBtn: { border: "none", background: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },

    actions: { display: "flex", gap: "12px" },
    downloadBtn: { border: "none", background: "var(--primary)", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
    printBtn: { border: "1px solid #cbd5e1", background: "white", color: "#334155", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" },

    invoiceWrapper: {}
};
