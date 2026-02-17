import Layout from "../components/Layout";

export default function AboutUs() {
    return (
        <Layout>
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>Our Story</h1>
                    <p style={styles.subtitle}>Redefining luxury since 2010</p>
                </div>
            </div>

            <div style={styles.container}>
                <section style={styles.section}>
                    <div style={styles.textBlock}>
                        <h2 style={styles.sectionTitle}>Welcome to Ocean View</h2>
                        <p style={styles.text}>
                            Nestled along the pristine coastline, Ocean View Resort offers an unparalleled escape from the ordinary.
                            Our journey began with a simple vision: to create a sanctuary where nature's beauty meets modern luxury.
                        </p>
                        <p style={styles.text}>
                            Whether you're seeking a romantic getaway, a family adventure, or a peaceful retreat, our resort provides
                            the perfect backdrop for unforgettable memories.
                        </p>
                    </div>
                    <div style={styles.imageBlock}>
                        <img
                            src="https://images.unsplash.com/photo-1571896349842-6e53ce41e887?auto=format&fit=crop&w=800&q=80"
                            alt="Resort Pool"
                            style={styles.image}
                        />
                    </div>
                </section>

                <section style={styles.features}>
                    <div style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>World-Class Dining</h3>
                        <p style={styles.featureText}>Savor exquisite flavors prepared by our award-winning chefs using the freshest local ingredients.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>Premium Spa</h3>
                        <p style={styles.featureText}>Rejuvenate your mind and body with our exclusive spa treatments and wellness programs.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>Ocean Adventures</h3>
                        <p style={styles.featureText}>Explore the deep blue with our guided diving tours, snorkeling, and water sports.</p>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

const styles = {
    hero: {
        height: "60vh",
        background: "linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
    },
    heroContent: {
        maxWidth: "800px",
        padding: "20px",
    },
    title: {
        fontSize: "4rem",
        marginBottom: "1rem",
        letterSpacing: "-1px",
    },
    subtitle: {
        fontSize: "1.5rem",
        fontWeight: "300",
        color: "rgba(255, 255, 255, 0.9)",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 24px",
    },
    section: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "60px",
        alignItems: "center",
        marginBottom: "100px",
    },
    textBlock: {
        background: "rgba(255, 255, 255, 0.03)",
        padding: "40px",
        borderRadius: "32px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
    },
    imageBlock: {
        position: "relative",
    },
    sectionTitle: {
        fontSize: "2.5rem",
        marginBottom: "24px",
        color: "var(--primary)",
    },
    text: {
        fontSize: "1.1rem",
        lineHeight: "1.8",
        color: "var(--text-dim)",
        marginBottom: "20px",
    },
    image: {
        width: "100%",
        borderRadius: "24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    },
    features: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
    },
    featureCard: {
        background: "var(--bg-card)",
        padding: "40px",
        borderRadius: "24px",
        border: "1px solid var(--glass-border)",
        transition: "transform 0.3s ease",
    },
    featureTitle: {
        fontSize: "1.5rem",
        marginBottom: "16px",
        color: "var(--text-light)",
    },
    featureText: {
        color: "var(--text-dim)",
        lineHeight: "1.6",
    },
};
