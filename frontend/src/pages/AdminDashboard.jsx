import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { FaPlus, FaCalendarAlt, FaUsers, FaChartLine, FaArrowRight, FaBed, FaDoorOpen, FaShieldAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("ROOMS");
    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({
        roomNumber: "",
        name: "",
        type: "STANDARD",
        price: "",
        desc: "",
        image: ""
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== "admin") {
                alert("Access Denied: Admins only");
                navigate("/");
                return;
            }
            setUser(parsedUser);
            fetchData();
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate("/");
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const [roomsRes, resRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/api/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/reservations`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setRooms(roomsRes.data);
            setReservations(resRes.data);
            setUsersList(usersRes.data);
        } catch (err) {
            console.error("Data fetch error:", err);
        }
    };

    const handleResync = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API_URL}/api/rooms/resync`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Resync failed");
        }
    };

    const handleDeleteReservation = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reservation?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Reservation deleted! 🗑️");
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Error deleting reservation");
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/api/rooms`, roomForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Room added successfully! ✅");
            setShowAddRoom(false);
            setRoomForm({ roomNumber: "", name: "", type: "STANDARD", price: "", desc: "", image: "" });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error adding room");
        }
    };

    if (!user) return null;

    return (
        <Layout>
            <div style={styles.page}>
                <div style={styles.container}>
                    {/* TOP BAR */}
                    <header style={styles.header}>
                        <div>
                            <h1 style={styles.title}>Resort Management</h1>
                            <p style={styles.subtitle}>Welcome back, <span style={{ color: "var(--primary)" }}>{user.name}</span></p>
                        </div>
                        <div style={styles.tabBar}>
                            <button onClick={() => setActiveTab("ROOMS")} style={activeTab === "ROOMS" ? styles.tabActive : styles.tab}>Rooms</button>
                            <button onClick={() => setActiveTab("RESERVATIONS")} style={activeTab === "RESERVATIONS" ? styles.tabActive : styles.tab}>Reservations</button>
                            <button onClick={() => setActiveTab("USERS")} style={activeTab === "USERS" ? styles.tabActive : styles.tab}>Guests</button>
                            <button onClick={fetchData} style={styles.refreshBtn}>Refresh Data</button>
                            <button onClick={handleResync} style={styles.syncBtn}>Sync Room Status</button>
                        </div>
                    </header>

                    {activeTab === "ROOMS" && (
                        <div style={styles.section}>
                            <div style={styles.sectionHead}>
                                <h2>Room Inventory ({rooms.length})</h2>
                                <button style={styles.addBtn} onClick={() => setShowAddRoom(true)}><FaPlus /> Add New Room</button>
                            </div>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Room No</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price (LKR)</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map(r => (
                                            <tr key={r._id}>
                                                <td style={{ fontWeight: "800", color: "var(--primary)" }}>#{r.roomNumber}</td>
                                                <td>{r.name}</td>
                                                <td><span style={styles.badge}>{r.type}</span></td>
                                                <td>{r.price.toLocaleString()}</td>
                                                <td>
                                                    <span style={r.isAvailable ? styles.statusAvail : styles.statusBooked}>
                                                        {r.isAvailable ? "Available" : "Occupied"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "RESERVATIONS" && (
                        <div style={styles.section}>
                            <h2>Active Bookings ({reservations.length})</h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Guest</th>
                                            <th>Room</th>
                                            <th>Stay</th>
                                            <th>Payment</th>
                                            <th>Receipt</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map(res => (
                                            <tr key={res._id}>
                                                <td style={{ fontSize: "11px", color: "var(--text-dim)" }}>{res.reservationNumber}</td>
                                                <td>
                                                    <div style={{ fontWeight: "600" }}>{res.user?.name}</div>
                                                    <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{res.user?.email}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: "600" }}>{res.room?.name}</div>
                                                    <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: "700" }}>
                                                        #{res.room?.roomNumber} {res.experiences?.length > 0 && `• ${res.experiences.length} Add-ons`}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: "13px" }}>{new Date(res.checkIn).toLocaleDateString()}</div>
                                                    <div style={{ fontSize: "13px" }}>- {new Date(res.checkOut).toLocaleDateString()}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: "700", fontSize: "12px" }}>{res.paymentMethod}</div>
                                                </td>
                                                <td>
                                                    {res.paymentReceipt ? (
                                                        <a href={`${API_URL}${res.paymentReceipt}`} target="_blank" rel="noreferrer" style={styles.viewImgBtn}>
                                                            View Receipt
                                                        </a>
                                                    ) : (
                                                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>No Receipt</span>
                                                    )}
                                                </td>
                                                <td>LKR {res.price.toLocaleString()}</td>
                                                <td><span style={styles.resBadge}>{res.status}</span></td>
                                                <td>
                                                    <button onClick={() => handleDeleteReservation(res._id)} style={styles.deleteBtn}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "USERS" && (
                        <div style={styles.section}>
                            <h2>Registered Guests ({usersList.length})</h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name / Email</th>
                                            <th>Contact Info</th>
                                            <th>Address</th>
                                            <th>ID / Passport</th>
                                            <th>Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersList.map(u => (
                                            <tr key={u._id}>
                                                <td>
                                                    <div style={{ fontWeight: "800" }}>{u.name}</div>
                                                    <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{u.email}</div>
                                                    <div style={{ ...styles.badge, marginTop: "4px", display: "inline-block" }}>{u.role.toUpperCase()}</div>
                                                </td>
                                                <td>
                                                    {u.whatsapp && <div style={{ fontSize: "13px" }}><b>WA:</b> {u.whatsapp}</div>}
                                                    {u.contactNumber && <div style={{ fontSize: "13px" }}><b>Tel:</b> {u.contactNumber}</div>}
                                                </td>
                                                <td style={{ maxWidth: "200px", fontSize: "12px", color: "var(--text-dim)" }}>
                                                    {u.address || "N/A"}
                                                </td>
                                                <td style={{ fontWeight: "700", color: "var(--secondary)" }}>
                                                    {u.idNumber || "Not Provided"}
                                                </td>
                                                <td>
                                                    {u.idImage ? (
                                                        <a href={`${API_URL}${u.idImage}`} target="_blank" rel="noreferrer" style={styles.viewImgBtn}>
                                                            View ID Image
                                                        </a>
                                                    ) : (
                                                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>No Upload</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ADD ROOM MODAL */}
                    {showAddRoom && (
                        <div style={styles.overlay} onClick={() => setShowAddRoom(false)}>
                            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                                <header style={styles.mHead}>
                                    <h2 style={{ margin: 0 }}>Add Room</h2>
                                    <button style={styles.mClose} onClick={() => setShowAddRoom(false)}>✕</button>
                                </header>
                                <form onSubmit={handleAddRoom} style={styles.form}>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Room Number (Unique)</label>
                                        <input style={styles.fIn} placeholder="101" required value={roomForm.roomNumber} onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })} />
                                    </div>
                                    <div style={styles.fRow}>
                                        <div style={styles.fGroup}>
                                            <label style={styles.fLab}>Room Name</label>
                                            <input style={styles.fIn} placeholder="Golden Suite" required value={roomForm.name} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} />
                                        </div>
                                        <div style={styles.fGroup}>
                                            <label style={styles.fLab}>Category</label>
                                            <select style={styles.fSel} value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}>
                                                <option value="STANDARD">Standard</option>
                                                <option value="DELUXE">Deluxe</option>
                                                <option value="SUITE">Suite</option>
                                                <option value="PRESIDENTIAL">Presidential</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Price per Night (LKR)</label>
                                        <input type="number" style={styles.fIn} min="20000" placeholder="25000" required value={roomForm.price} onChange={e => setRoomForm({ ...roomForm, price: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Image URL</label>
                                        <input style={styles.fIn} placeholder="https://..." value={roomForm.image} onChange={e => setRoomForm({ ...roomForm, image: e.target.value })} />
                                    </div>
                                    <button type="submit" style={styles.mSubmit}>Register Room</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    page: { background: "#f8fafc", minHeight: "100vh", padding: "60px 40px" },
    container: { maxWidth: "1200px", margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" },
    title: { fontSize: "32px", fontWeight: "900", letterSpacing: "-1px" },
    subtitle: { color: "var(--text-dim)", fontSize: "16px" },

    tabBar: { background: "white", padding: "8px", borderRadius: "16px", display: "flex", gap: "8px", border: "1px solid var(--border)" },
    tab: { padding: "10px 20px", border: "none", background: "transparent", borderRadius: "10px", fontWeight: "700", cursor: "pointer", color: "var(--text-dim)" },
    tabActive: { padding: "10px 20px", border: "none", background: "var(--primary)", color: "white", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
    refreshBtn: { background: "none", border: "none", color: "var(--primary)", fontWeight: "800", cursor: "pointer", fontSize: "13px", padding: "0 12px" },
    syncBtn: { background: "#f1f5f9", border: "none", color: "var(--secondary)", fontWeight: "800", cursor: "pointer", fontSize: "11px", padding: "6px 12px", borderRadius: "8px" },

    section: { background: "white", padding: "32px", borderRadius: "32px", border: "1px solid var(--border)", boxShadow: "var(--shadow)" },
    sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
    addBtn: { background: "var(--primary)", color: "white", border: "none", padding: "12px 24px", borderRadius: "14px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },

    tableWrapper: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    th: { padding: "16px", borderBottom: "2px solid #f1f5f9", color: "var(--text-dim)", fontSize: "13px", textTransform: "uppercase", fontWeight: "800" },
    td: { padding: "16px", borderBottom: "1px solid #f1f5f9", fontSize: "15px" },

    badge: { background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800" },
    resBadge: { background: "var(--primary-light)", color: "var(--primary)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800" },
    deleteBtn: { background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" },
    statusAvail: { background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "800" },
    statusBooked: { background: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "800" },
    viewImgBtn: { display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textDecoration: "none" },

    overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modal: { background: "white", width: "100%", maxWidth: "500px", borderRadius: "32px", padding: "40px" },
    mHead: { display: "flex", justifyContent: "space-between", marginBottom: "32px" },
    mClose: { border: "none", background: "none", fontSize: "24px", cursor: "pointer" },

    form: { display: "flex", flexDirection: "column", gap: "20px" },
    fRow: { display: "flex", gap: "16px" },
    fGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
    fLab: { fontSize: "13px", fontWeight: "700" },
    fIn: { padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", background: "#f8fafc" },
    fSel: { padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", background: "#f8fafc" },
    mSubmit: { background: "var(--primary)", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" }
};
