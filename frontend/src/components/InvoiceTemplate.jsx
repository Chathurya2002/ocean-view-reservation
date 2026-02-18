import React from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const InvoiceTemplate = React.forwardRef(({ reservation }, ref) => {
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
        <div ref={ref} style={styles.invoice}>
            <div style={styles.invHeader}>
                <h2 style={styles.brand}>Ocean View Resort</h2>
                <div style={styles.invMeta}>
                    <div><strong>Invoice #:</strong> {reservationNumber}</div>
                    <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.guestInfo}>
                <h3>Guest Details</h3>
                <p><strong>Name:</strong> {reservation.user?.name}</p>
                <p><strong>Email:</strong> {reservation.user?.email}</p>
            </div>

            <div style={styles.table}>
                <div style={styles.tHead}>
                    <span>Description</span>
                    <span>Total</span>
                </div>

                {/* Room Details */}
                {room && (
                    <div style={styles.tRow}>
                        <div>
                            <strong>{room.name}</strong>
                            <div style={styles.sm}>Room #{room.roomNumber} • {nightCount} Night(s)</div>
                            <div style={styles.sm}>{new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}</div>
                        </div>
                        <span>LKR {roomTotal.toLocaleString()}</span>
                    </div>
                )}

                {/* Experiences */}
                {experiences && experiences.map((expItem, idx) => {
                    const exp = expItem.experience || expItem;
                    return (
                        <div key={idx} style={styles.tRow}>
                            <div>
                                <strong>Experience: {exp.name}</strong>
                                <div style={styles.sm}>{exp.category} • {exp.duration}</div>
                                {expItem.date && <div style={styles.sm}>Date: {new Date(expItem.date).toLocaleDateString()}</div>}
                            </div>
                            <span>LKR {exp.price ? exp.price.toLocaleString() : "0"}</span>
                        </div>
                    );
                })}

                {/* Rentals */}
                {rentals && rentals.map((rentItem, idx) => {
                    const rental = rentItem.rental || rentItem;
                    const itemTotal = (rental.price || 0) * (rentItem.days || 1);
                    return (
                        <div key={idx} style={styles.tRow}>
                            <div>
                                <strong>Rental: {rental.name}</strong>
                                <div style={styles.sm}>{rental.type} • {rentItem.days || 1} Day(s)</div>
                                {rentItem.startDate && (
                                    <div style={styles.sm}>
                                        {new Date(rentItem.startDate).toLocaleDateString()} - {new Date(rentItem.endDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <span>LKR {itemTotal.toLocaleString()}</span>
                        </div>
                    );
                })}
            </div>

            <div style={styles.totalSection}>
                <div style={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>LKR {calculatedTotal.toLocaleString()}</span>
                </div>
                <div style={styles.totalRow}>
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                </div>
                <div style={{ ...styles.totalRow, fontSize: "18px", marginTop: "10px", color: "var(--primary)" }}>
                    <span>Total Paid ({paymentMethod})</span>
                    <span>LKR {price.toLocaleString()}</span>
                </div>
            </div>

            <div style={styles.footer}>
                <p>Questions? Contact us at support@oceanview.lk</p>
                <p>Galle, Hikkaduwa, Sri Lanka</p>
            </div>
        </div>
    );
});

const styles = {
    invoice: { background: "white", padding: "40px", borderRadius: "0", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", textAlign: "left", marginBottom: "30px", maxWidth: "800px", margin: "0 auto" },
    invHeader: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" },
    brand: { color: "var(--primary)", fontSize: "24px", fontWeight: "900", margin: 0 },
    invMeta: { textAlign: "right", fontSize: "12px", color: "var(--text-dim)", lineHeight: "1.6" },

    divider: { height: "2px", background: "#f1f5f9", margin: "20px 0" },

    guestInfo: { marginBottom: "30px", fontSize: "14px", lineHeight: "1.6", color: "var(--secondary)" },

    table: { marginBottom: "30px" },
    tHead: { display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#94a3b8", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", marginBottom: "16px" },
    tRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--secondary)", fontWeight: "600", marginBottom: "12px" },
    sm: { fontSize: "12px", color: "var(--text-dim)", fontWeight: "400", marginTop: "4px" },

    totalSection: { background: "#f8fafc", padding: "20px", borderRadius: "12px" },
    totalRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "700", color: "var(--secondary)", marginBottom: "8px" },

    footer: { marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#cbd5e1" },
};

export default InvoiceTemplate;
