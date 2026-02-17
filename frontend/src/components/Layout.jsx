import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div style={styles.layout}>
            <Navbar />
            <main style={styles.main}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

const styles = {
    layout: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--bg-main)",
        color: "var(--text-main)",
    },
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
};
