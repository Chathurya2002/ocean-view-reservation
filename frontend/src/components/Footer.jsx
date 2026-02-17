import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.top}>
                    <div style={styles.brandSection}>
                        <h2 style={styles.brand}>Ocean<span style={{ color: "var(--primary)" }}>View</span></h2>
                        <p style={styles.desc}>Experience luxury and comfort in the heart of the ocean. Your perfect getaway awaits.</p>
                    </div>

                    <div style={styles.linksSection}>
                        <h4 style={styles.title}>Quick Links</h4>
                        <a href="/" style={styles.link}>Home</a>
                        <a href="/rooms" style={styles.link}>Rooms</a>
                        <a href="/about" style={styles.link}>About Us</a>
                        <a href="/contact" style={styles.link}>Contact</a>
                    </div>

                    <div style={styles.socialSection}>
                        <h4 style={styles.title}>Follow Us</h4>
                        <div style={styles.icons}>
                            <a href="#" style={styles.icon}><FaFacebookF /></a>
                            <a href="#" style={styles.icon}><FaTwitter /></a>
                            <a href="#" style={styles.icon}><FaInstagram /></a>
                            <a href="#" style={styles.icon}><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>

                <div style={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} OceanView Resort. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        background: "#0f172a",
        borderTop: "1px solid var(--glass-border)",
        padding: "60px 24px 24px",
        color: "var(--text-dim)",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    top: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        marginBottom: "40px",
    },
    brand: {
        color: "var(--text-light)",
        fontSize: "24px",
        marginBottom: "16px",
    },
    desc: {
        lineHeight: "1.6",
        fontSize: "14px",
    },
    title: {
        color: "var(--text-light)",
        fontSize: "16px",
        marginBottom: "20px",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    linksSection: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    link: {
        color: "var(--text-dim)",
        fontSize: "14px",
        transition: "color 0.2s",
    },
    icons: {
        display: "flex",
        gap: "16px",
    },
    icon: {
        color: "var(--text-light)",
        fontSize: "18px",
        transition: "transform 0.2s, color 0.2s",
    },
    bottom: {
        borderTop: "1px solid var(--glass-border)",
        paddingTop: "24px",
        textAlign: "center",
        fontSize: "13px",
    },
};
