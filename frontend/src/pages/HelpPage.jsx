import { useState } from "react";
import Layout from "../components/Layout";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaCheckCircle, FaCreditCard, FaCalendarAlt, FaUserEdit } from "react-icons/fa";

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I book a room?",
            answer: "To book a room: (1) Search for available rooms on the home page by selecting your check-in/check-out dates and number of guests. (2) Browse available rooms and click on your preferred room. (3) Complete your profile if it's your first booking (WhatsApp, contact number, ID/passport details). (4) Optionally select extra experiences/trips. (5) Choose your payment method (Card, Bank Transfer, or Cash at Property). (6) Confirm your booking and download your invoice."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept three payment methods: (1) Debit/Credit Card - Secure online payment with instant confirmation. (2) Bank Transfer - Upload your payment receipt after transferring to our account. (3) Cash at Property - Pay when you arrive at the resort. All payments are in Sri Lankan Rupees (LKR)."
        },
        {
            question: "How do I add extra experiences to my booking?",
            answer: "When booking a room, scroll down to the 'Enhance Your Stay' section on the room details page. You'll see 10 curated local experiences in the Galle area. Click on any experience card to select/deselect it. The total price will update automatically. You can also browse all experiences by clicking 'Extra Trips' in the navigation menu."
        },
        {
            question: "What is the cancellation policy?",
            answer: "We offer a flexible cancellation policy. You can cancel your reservation through your profile or by contacting our support team at support@oceanview.lk. Please note that cancellation terms may vary based on your booking dates and room type. Contact us for specific details about your reservation."
        },
        {
            question: "Do I need to complete my profile before booking?",
            answer: "Yes, for security and verification purposes, you must complete your profile before making a reservation. Required information includes: WhatsApp number, contact number, home address, ID/Passport number, and a photo of your ID/Passport. We use OCR technology to auto-detect your ID number from the uploaded image."
        },
        {
            question: "Can I upload my payment receipt?",
            answer: "Yes! If you choose 'Bank Transfer' as your payment method, you'll be prompted to upload your payment receipt. You can upload image files (JPG, PNG) or PDF documents. For card payments, receipt upload is optional but recommended for your records."
        },
        {
            question: "How do I view my reservations?",
            answer: "After logging in, click on your name in the navigation bar and select 'Profile'. Your profile page will display all your current and past reservations, including booking details, payment status, and selected experiences."
        },
        {
            question: "What are the check-in and check-out times?",
            answer: "Check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability. Please contact us at +94 77 123 4567 to arrange special timing."
        },
        {
            question: "What experiences are available?",
            answer: "We offer 10 curated local experiences including: Galle Fort Sunset Walk, Mirissa Blue Whale Safari, Ayurvedic Healing Rituals, Cinnamon Island Canoe Voyage, Stilt Fisherman Photo Ops, Private Seafood Dinners, Turtle Hatchery & Snorkeling, Mangrove Safaris, Sunrise Yoga, and Romantic Picnics. Prices range from LKR 3,000 to LKR 32,000."
        },
        
    ];

    const bookingSteps = [
        { icon: <FaCalendarAlt />, title: "Search Dates", desc: "Select check-in and check-out dates" },
        { icon: <FaCheckCircle />, title: "Choose Room", desc: "Browse and select your preferred room" },
        { icon: <FaUserEdit />, title: "Complete Profile", desc: "Fill in your details (first time only)" },
        { icon: <FaQuestionCircle />, title: "Add Experiences", desc: "Select optional trips & activities" },
        { icon: <FaCreditCard />, title: "Payment", desc: "Choose payment method and confirm" },
        { icon: <FaCheckCircle />, title: "Confirmation", desc: "Download your invoice" }
    ];

    return (
        <Layout>
            <div style={styles.page}>
                {/* HERO */}
                <div style={styles.hero}>
                    <div style={styles.heroContent}>
                        <FaQuestionCircle size={60} style={{ color: "var(--primary)", marginBottom: "20px" }} />
                        <h1 style={styles.heroTitle}>How Can We Help You?</h1>
                        <p style={styles.heroSub}>Find answers to common questions about booking, payments, and our services.</p>
                    </div>
                </div>

                <div style={styles.container}>
                    {/* BOOKING GUIDE */}
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Booking Guide</h2>
                        <p style={styles.sectionDesc}>Follow these simple steps to complete your reservation</p>
                        <div style={styles.stepsGrid}>
                            {bookingSteps.map((step, idx) => (
                                <div key={idx} style={styles.stepCard}>
                                    <div style={styles.stepIcon}>{step.icon}</div>
                                    <div style={styles.stepNumber}>{idx + 1}</div>
                                    <h3 style={styles.stepTitle}>{step.title}</h3>
                                    <p style={styles.stepDesc}>{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
                        <p style={styles.sectionDesc}>Quick answers to questions you may have</p>
                        <div style={styles.faqContainer}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={styles.faqItem}>
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        style={styles.faqQuestion}
                                    >
                                        <span style={styles.faqQ}>{faq.question}</span>
                                        {openFaq === idx ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                    {openFaq === idx && (
                                        <div style={styles.faqAnswer}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CONTACT */}
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Contact Support</h2>
                        <p style={styles.sectionDesc}>Still need help? Reach out to our team</p>
                        <div style={styles.contactGrid}>
                            <div style={styles.contactCard}>
                                <FaEnvelope size={32} style={{ color: "var(--primary)" }} />
                                <h3 style={styles.contactTitle}>Email</h3>
                                <a href="mailto:support@oceanview.lk" style={styles.contactLink}>support@oceanview.lk</a>
                            </div>
                            <div style={styles.contactCard}>
                                <FaPhone size={32} style={{ color: "var(--primary)" }} />
                                <h3 style={styles.contactTitle}>Phone</h3>
                                <a href="tel:+94771234567" style={styles.contactLink}>+94 77 123 4567</a>
                            </div>
                            <div style={styles.contactCard}>
                                <FaWhatsapp size={32} style={{ color: "#25D366" }} />
                                <h3 style={styles.contactTitle}>WhatsApp</h3>
                                <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" style={styles.contactLink}>+94 77 123 4567</a>
                            </div>
                            <div style={styles.contactCard}>
                                <FaMapMarkerAlt size={32} style={{ color: "var(--primary)" }} />
                                <h3 style={styles.contactTitle}>Location</h3>
                                <p style={styles.contactText}>Galle, Hikkaduwa, Sri Lanka</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    page: { background: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" },

    hero: {
        height: "350px",
        background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        marginBottom: "60px"
    },
    heroContent: { maxWidth: "700px", padding: "0 24px" },
    heroTitle: { fontSize: "48px", fontWeight: "900", marginBottom: "16px", letterSpacing: "-1px" },
    heroSub: { fontSize: "18px", opacity: 0.95, lineHeight: "1.6" },

    container: { maxWidth: "1000px", margin: "0 auto", padding: "0 24px" },

    section: { marginBottom: "80px" },
    sectionTitle: { fontSize: "32px", fontWeight: "900", color: "var(--secondary)", marginBottom: "12px", textAlign: "center" },
    sectionDesc: { fontSize: "16px", color: "var(--text-dim)", textAlign: "center", marginBottom: "40px" },

    // Booking Steps
    stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "24px" },
    stepCard: { background: "white", padding: "24px", borderRadius: "20px", textAlign: "center", border: "1px solid #e2e8f0", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    stepIcon: { fontSize: "32px", color: "var(--primary)", marginBottom: "12px" },
    stepNumber: { position: "absolute", top: "12px", right: "12px", background: "var(--primary-light)", color: "var(--primary)", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800" },
    stepTitle: { fontSize: "16px", fontWeight: "800", color: "var(--secondary)", marginBottom: "8px" },
    stepDesc: { fontSize: "13px", color: "var(--text-dim)", lineHeight: "1.4" },

    // FAQ
    faqContainer: { maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" },
    faqItem: { background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
    faqQuestion: { width: "100%", padding: "20px 24px", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", fontSize: "16px", fontWeight: "700", color: "var(--secondary)", transition: "background 0.2s" },
    faqQ: { flex: 1, paddingRight: "16px" },
    faqAnswer: { padding: "0 24px 24px 24px", fontSize: "14px", color: "#64748b", lineHeight: "1.7", borderTop: "1px solid #f1f5f9" },

    // Contact
    contactGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
    contactCard: { background: "white", padding: "32px", borderRadius: "20px", textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    contactTitle: { fontSize: "18px", fontWeight: "800", color: "var(--secondary)", margin: "16px 0 8px 0" },
    contactLink: { fontSize: "14px", color: "var(--primary)", fontWeight: "600", textDecoration: "none" },
    contactText: { fontSize: "14px", color: "var(--text-dim)", fontWeight: "600", margin: 0 }
};
