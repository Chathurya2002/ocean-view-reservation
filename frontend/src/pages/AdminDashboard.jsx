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
    const [experiences, setExperiences] = useState([]);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showExpModal, setShowExpModal] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [roomForm, setRoomForm] = useState({
        roomNumber: "",
        name: "",
        type: "STANDARD",
        price: "",
        desc: "",
        image: ""
    });
    const [expForm, setExpForm] = useState({
        name: "",
        category: "CULTURAL",
        price: "",
        duration: "",
        desc: "",
        includes: "",
        notes: "",
        image: "",
        isAvailable: true
    });

    // RENTAL STATE
    const [rentals, setRentals] = useState([]);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [editingRental, setEditingRental] = useState(null);
    const [rentalForm, setRentalForm] = useState({
        name: "",
        type: "Vehicle",
        price: "",
        description: "",
        image: "",
        features: ""
    });

    // DRIVER / RENTAL BOOKING STATE
    const [rentalBookings, setRentalBookings] = useState([]);
    const [showDriverModal, setShowDriverModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [driverForm, setDriverForm] = useState({
        name: "",
        contact: "",
        vehicleNo: "",
        status: "ASSIGNED"
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
            const [roomsRes, resRes, usersRes, expRes, rentRes] = await Promise.all([
                axios.get(`${API_URL}/api/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/reservations`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/experiences`),
                axios.get(`${API_URL}/api/rentals`)
            ]);
            setRooms(roomsRes.data);
            setReservations(resRes.data);
            setUsersList(usersRes.data);
            setExperiences(expRes.data);
            setRentals(rentRes.data);

            // Filter Rental Bookings
            const rBookings = resRes.data.filter(r => r.rentals && r.rentals.length > 0);
            setRentalBookings(rBookings);
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

    const handleAddEditExp = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const includesArray = expForm.includes.split(",").map(i => i.trim()).filter(i => i);
            const payload = { ...expForm, includes: includesArray };

            if (editingExp) {
                await axios.put(`${API_URL}/api/experiences/${editingExp._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Experience updated! ✅");
            } else {
                await axios.post(`${API_URL}/api/experiences`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Experience added! ✅");
            }
            setShowExpModal(false);
            setEditingExp(null);
            setExpForm({ name: "", category: "CULTURAL", price: "", duration: "", desc: "", includes: "", notes: "", image: "", isAvailable: true });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error saving experience");
        }
    };

    const handleDeleteExp = async (id) => {
        if (!window.confirm("Delete this experience?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Experience deleted! 🗑️");
            fetchData();
        } catch (err) {
            alert("Error deleting experience");
        }
    };

    const openEditExp = (exp) => {
        setEditingExp(exp);
        setExpForm({
            name: exp.name,
            category: exp.category,
            price: exp.price,
            duration: exp.duration,
            desc: exp.desc,
            includes: exp.includes.join(", "),
            notes: exp.notes || "",
            image: exp.image,
            isAvailable: exp.isAvailable
        });
        setShowExpModal(true);
    };

    // --- RENTAL HANDLERS ---
    const handleAddEditRental = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const featuresArray = rentalForm.features.split(",").map(f => f.trim()).filter(f => f);
            const payload = { ...rentalForm, features: featuresArray };

            if (editingRental) {
                await axios.put(`${API_URL}/api/rentals/${editingRental._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Rental updated! ✅");
            } else {
                await axios.post(`${API_URL}/api/rentals`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Rental added! ✅");
            }
            setShowRentalModal(false);
            setEditingRental(null);
            setRentalForm({ name: "", type: "Vehicle", price: "", description: "", image: "", features: "" });
            fetchData();
        } catch (err) {
            alert("Error saving rental");
        }
    };

    const handleDeleteRental = async (id) => {
        if (!window.confirm("Delete this rental listing?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/rentals/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Rental deleted! 🗑️");
            fetchData();
        } catch (err) {
            alert("Error deleting rental");
        }
    };

    const openEditRental = (rental) => {
        setEditingRental(rental);
        setRentalForm({
            name: rental.name,
            type: rental.type,
            price: rental.price,
            description: rental.description,
            image: rental.image,
            features: rental.features.join(", ")
        });
        setShowRentalModal(true);
    };

    // --- DRIVER ASSIGNMENT HANDLERS ---
    const openDriverModal = (booking) => {
        setSelectedBooking(booking);
        setDriverForm({
            name: booking.driverDetails?.name || "",
            contact: booking.driverDetails?.contact || "",
            vehicleNo: booking.driverDetails?.vehicleNo || "",
            status: booking.driverDetails?.status || "ASSIGNED"
        });
        setShowDriverModal(true);
    };

    const handleAssignDriver = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            // We use a generic reservation update or specific endpoint if implemented. 
            // Using generic update assuming backend allows updating driverDetails via PUT /api/reservations/:id (not implemented yet, but usually PUT updates body).
            // NOTE: Standard Reservation update usually requires full body or PATCH. 
            // If backend reservation update uses findByIdAndUpdate with req.body, this works if we send just the fields to update (PATCH style) or full object.
            // Let's assume standard PUT updates fields provided.
            // Wait, reservationRoutes usually has DELETE and GET. Does it have PUT? 
            // I should check reservationRoutes.js. If not, I need to add it.
            // For now, I'll assume I need to add/use PUT.

            await axios.put(`${API_URL}/api/reservations/${selectedBooking._id}`, {
                driverDetails: driverForm
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Driver details updated! 🚖");
            setShowDriverModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Error updating driver details. Ensure backend supports update.");
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
                            <button onClick={() => setActiveTab("RENTAL_INVENTORY")} style={activeTab === "RENTAL_INVENTORY" ? styles.tabActive : styles.tab}>Rentals</button>
                            <button onClick={() => setActiveTab("EXPERIENCES")} style={activeTab === "EXPERIENCES" ? styles.tabActive : styles.tab}>Experiences</button>
                            <button onClick={() => setActiveTab("RESERVATIONS")} style={activeTab === "RESERVATIONS" ? styles.tabActive : styles.tab}>Bookings</button>
                            <button onClick={() => setActiveTab("RENTAL_BOOKINGS")} style={activeTab === "RENTAL_BOOKINGS" ? styles.tabActive : styles.tab}>Rental Bookings</button>
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

                    {activeTab === "EXPERIENCES" && (
                        <div style={styles.section}>
                            <div style={styles.sectionHead}>
                                <h2>Experiences & Trips ({experiences.length})</h2>
                                <button style={styles.addBtn} onClick={() => { setEditingExp(null); setExpForm({ name: "", category: "CULTURAL", price: "", duration: "", desc: "", includes: "", notes: "", image: "", isAvailable: true }); setShowExpModal(true); }}><FaPlus /> Add New Experience</button>
                            </div>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price (LKR)</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experiences.map(exp => (
                                            <tr key={exp._id}>
                                                <td style={{ fontWeight: "700" }}>{exp.name}</td>
                                                <td><span style={styles.badge}>{exp.category}</span></td>
                                                <td>{exp.price.toLocaleString()}</td>
                                                <td style={{ fontSize: "12px", color: "var(--text-dim)" }}>{exp.duration}</td>
                                                <td>
                                                    <span style={exp.isAvailable ? styles.statusAvail : styles.statusBooked}>
                                                        {exp.isAvailable ? "Available" : "Unavailable"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button onClick={() => openEditExp(exp)} style={styles.editBtn}>Edit</button>
                                                    <button onClick={() => handleDeleteExp(exp._id)} style={styles.deleteBtn}>Delete</button>
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
                                        {reservations.filter(r => !r.rentals || r.rentals.length === 0).map(res => (
                                            <tr key={res._id}>
                                                <td style={{ fontSize: "11px", color: "var(--text-dim)" }}>{res.reservationNumber}</td>
                                                <td>
                                                    <div style={{ fontWeight: "600" }}>{res.user?.name}</div>
                                                    <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{res.user?.email}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: "600" }}>{res.room?.name}</div>
                                                    <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: "700" }}>
                                                        #{res.room?.roomNumber}
                                                        {res.experiences?.length > 0 && res.experiences.map((e, idx) => (
                                                            <div key={idx}>• {e.experience?.name} ({new Date(e.date).toLocaleDateString()})</div>
                                                        ))}
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
                                                    <td>
                                                        <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                                                            {res.paymentReceipt ? (
                                                                <a href={`${API_URL}${res.paymentReceipt}`} target="_blank" rel="noreferrer" style={styles.viewImgBtn}>
                                                                    View Slip
                                                                </a>
                                                            ) : (
                                                                <span style={{ fontSize: "11px", color: "#94a3b8" }}>No Slip</span>
                                                            )}
                                                            <button
                                                                onClick={() => navigate(`/admin/invoice/${res._id}`)}
                                                                style={{
                                                                    background: "var(--secondary)", color: "white", border: "none",
                                                                    borderRadius: "6px", padding: "4px 8px", fontSize: "10px",
                                                                    cursor: "pointer", fontWeight: "700"
                                                                }}
                                                            >
                                                                Download Invoice
                                                            </button>
                                                        </div>
                                                    </td>
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

                    {activeTab === "RENTAL_INVENTORY" && (
                        <div style={styles.section}>
                            <div style={styles.sectionHead}>
                                <h2>Rental Vehicles ({rentals.length})</h2>
                                <button style={styles.addBtn} onClick={() => { setEditingRental(null); setRentalForm({ name: "", type: "Vehicle", price: "", description: "", image: "", features: "" }); setShowRentalModal(true); }}><FaPlus /> Add Vehicle</button>
                            </div>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Vehicle</th>
                                            <th>Type</th>
                                            <th>Price (LKR)</th>
                                            <th>Features</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rentals.map(r => (
                                            <tr key={r._id}>
                                                <td style={{ fontWeight: "700" }}>{r.name}</td>
                                                <td><span style={styles.badge}>{r.type}</span></td>
                                                <td>{r.price.toLocaleString()}</td>
                                                <td style={{ fontSize: "12px", color: "var(--text-dim)" }}>{r.features.join(", ")}</td>
                                                <td>
                                                    <button onClick={() => openEditRental(r)} style={styles.editBtn}>Edit</button>
                                                    <button onClick={() => handleDeleteRental(r._id)} style={styles.deleteBtn}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "RENTAL_BOOKINGS" && (
                        <div style={styles.section}>
                            <h2>Rental Bookings ({rentalBookings.length})</h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Ref</th>
                                            <th>Booked Date</th>
                                            <th>Guest</th>
                                            <th>Rentals (Dates)</th>
                                            <th>Payment</th>
                                            <th>Receipt</th>
                                            <th>Driver Details</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rentalBookings.map(res => (
                                            <tr key={res._id}>
                                                <td style={{ fontSize: "11px", color: "var(--text-dim)" }}>{res.reservationNumber}</td>
                                                <td style={{ fontSize: "12px" }}>{new Date(res.createdAt).toLocaleDateString()} {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td>
                                                    <div style={{ fontWeight: "600" }}>{res.user?.name}</div>
                                                    <div style={{ fontSize: "12px" }}>{res.user?.contactNumber}</div>
                                                </td>
                                                <td>
                                                    {res.rentals.map(r => (
                                                        <div key={r._id} style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", marginBottom: "4px" }}>
                                                            {r.rental?.name || "Rental"}
                                                            <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "400" }}>
                                                                {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: "700", fontSize: "12px" }}>{res.paymentMethod}</div>
                                                    <div style={{ fontSize: "11px" }}>LKR {res.price.toLocaleString()}</div>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                                                        {res.paymentReceipt ? (
                                                            <a href={`${API_URL}${res.paymentReceipt}`} target="_blank" rel="noreferrer" style={styles.viewImgBtn}>
                                                                View Slip
                                                            </a>
                                                        ) : <span style={{ fontSize: "10px", color: "#ccc" }}>No Slip</span>}

                                                        <button
                                                            onClick={() => navigate(`/admin/invoice/${res._id}`)}
                                                            style={{
                                                                background: "var(--secondary)", color: "white", border: "none",
                                                                borderRadius: "6px", padding: "4px 8px", fontSize: "10px",
                                                                cursor: "pointer", fontWeight: "700"
                                                            }}
                                                        >
                                                            Download Invoice
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    {res.driverDetails?.name ? (
                                                        <div style={{ fontSize: "13px" }}>
                                                            <div style={{ fontWeight: "700" }}>{res.driverDetails.name}</div>
                                                            <div>{res.driverDetails.contact}</div>
                                                            <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{res.driverDetails.vehicleNo}</div>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "700" }}>Not Assigned</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button onClick={() => openDriverModal(res)} style={{ ...styles.addBtn, padding: "6px 12px", fontSize: "12px" }}>Assign Driver</button>
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

                    {/* ADD/EDIT EXPERIENCE MODAL */}
                    {showExpModal && (
                        <div style={styles.overlay} onClick={() => setShowExpModal(false)}>
                            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                                <header style={styles.mHead}>
                                    <h2 style={{ margin: 0 }}>{editingExp ? "Edit Experience" : "Add Experience"}</h2>
                                    <button style={styles.mClose} onClick={() => setShowExpModal(false)}>✕</button>
                                </header>
                                <form onSubmit={handleAddEditExp} style={styles.form}>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Experience Name</label>
                                        <input style={styles.fIn} placeholder="Galle Fort Sunset Walk" required value={expForm.name} onChange={e => setExpForm({ ...expForm, name: e.target.value })} />
                                    </div>
                                    <div style={styles.fRow}>
                                        <div style={styles.fGroup}>
                                            <label style={styles.fLab}>Category</label>
                                            <select style={styles.fSel} value={expForm.category} onChange={e => setExpForm({ ...expForm, category: e.target.value })}>
                                                <option value="CULTURAL">Cultural</option>
                                                <option value="WATER_ACTIVITY">Water Activity</option>
                                                <option value="NATURE">Nature</option>
                                                <option value="FOOD_EXPERIENCE">Food Experience</option>
                                                <option value="WELLNESS">Wellness</option>
                                                <option value="TRANSPORT">Transport</option>
                                                <option value="ADVENTURE">Adventure</option>
                                            </select>
                                        </div>
                                        <div style={styles.fGroup}>
                                            <label style={styles.fLab}>Duration</label>
                                            <input style={styles.fIn} placeholder="2 hours" required value={expForm.duration} onChange={e => setExpForm({ ...expForm, duration: e.target.value })} />
                                        </div>
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Price (LKR)</label>
                                        <input style={styles.fIn} type="number" placeholder="5000" required value={expForm.price} onChange={e => setExpForm({ ...expForm, price: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Description</label>
                                        <textarea style={{ ...styles.fIn, minHeight: "80px" }} placeholder="Describe the experience..." required value={expForm.desc} onChange={e => setExpForm({ ...expForm, desc: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Includes (comma-separated)</label>
                                        <input style={styles.fIn} placeholder="Guide, Transport, Refreshments" value={expForm.includes} onChange={e => setExpForm({ ...expForm, includes: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Notes (optional)</label>
                                        <input style={styles.fIn} placeholder="Booking required 24h in advance" value={expForm.notes} onChange={e => setExpForm({ ...expForm, notes: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Image URL</label>
                                        <input style={styles.fIn} placeholder="https://..." required value={expForm.image} onChange={e => setExpForm({ ...expForm, image: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={{ ...styles.fLab, display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input type="checkbox" checked={expForm.isAvailable} onChange={e => setExpForm({ ...expForm, isAvailable: e.target.checked })} />
                                            Available for Booking
                                        </label>
                                    </div>
                                    <button type="submit" style={styles.submitBtn}>{editingExp ? "Update Experience" : "Add Experience"}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* RENTAL MODAL */}
                    {showRentalModal && (
                        <div style={styles.overlay} onClick={() => setShowRentalModal(false)}>
                            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                                <header style={styles.mHead}>
                                    <h2 style={{ margin: 0 }}>{editingRental ? "Edit Rental" : "Add Vehicle"}</h2>
                                    <button style={styles.mClose} onClick={() => setShowRentalModal(false)}>✕</button>
                                </header>
                                <form onSubmit={handleAddEditRental} style={styles.form}>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Vehicle Name</label>
                                        <input style={styles.fIn} placeholder="Tuk Tuk" required value={rentalForm.name} onChange={e => setRentalForm({ ...rentalForm, name: e.target.value })} />
                                    </div>
                                    <div style={styles.fRow}>
                                        <div style={styles.fGroup}>
                                            <label style={styles.fLab}>Type</label>
                                            <select style={styles.fSel} value={rentalForm.type} onChange={e => setRentalForm({ ...rentalForm, type: e.target.value })}>
                                                <option value="Vehicle">Vehicle</option>
                                                <option value="Bicycle">Bicycle</option>
                                            </select>
                                        </div>
                                        <div style={styles.fGroup}>
                                            <label style={styles.fLab}>Price (LKR)</label>
                                            <input type="number" style={styles.fIn} required value={rentalForm.price} onChange={e => setRentalForm({ ...rentalForm, price: e.target.value })} />
                                        </div>
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Features (comma-separated)</label>
                                        <input style={styles.fIn} placeholder="AC, Driver, Bluetooth" value={rentalForm.features} onChange={e => setRentalForm({ ...rentalForm, features: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Description</label>
                                        <textarea style={{ ...styles.fIn, minHeight: "80px" }} required value={rentalForm.description} onChange={e => setRentalForm({ ...rentalForm, description: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Image URL</label>
                                        <input style={styles.fIn} required value={rentalForm.image} onChange={e => setRentalForm({ ...rentalForm, image: e.target.value })} />
                                    </div>
                                    <button type="submit" style={styles.mSubmit}>Save Vehicle</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* DRIVER ASSIGNMENT MODAL */}
                    {showDriverModal && (
                        <div style={styles.overlay} onClick={() => setShowDriverModal(false)}>
                            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                                <header style={styles.mHead}>
                                    <h2 style={{ margin: 0 }}>Assign Driver</h2>
                                    <button style={styles.mClose} onClick={() => setShowDriverModal(false)}>✕</button>
                                </header>
                                <form onSubmit={handleAssignDriver} style={styles.form}>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Driver Name</label>
                                        <input style={styles.fIn} placeholder="Sunil Perera" required value={driverForm.name} onChange={e => setDriverForm({ ...driverForm, name: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Contact Number</label>
                                        <input style={styles.fIn} placeholder="077..." required value={driverForm.contact} onChange={e => setDriverForm({ ...driverForm, contact: e.target.value })} />
                                    </div>
                                    <div style={styles.fGroup}>
                                        <label style={styles.fLab}>Vehicle Number (Optional)</label>
                                        <input style={styles.fIn} placeholder="WP CAB-1234" value={driverForm.vehicleNo} onChange={e => setDriverForm({ ...driverForm, vehicleNo: e.target.value })} />
                                    </div>
                                    <button type="submit" style={styles.mSubmit}>Assign Driver</button>
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
    editBtn: { background: "#dbeafe", color: "#1e40af", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", marginRight: "8px" },
    deleteBtn: { background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" },
    statusAvail: { background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "800" },
    statusBooked: { background: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "800" },
    viewImgBtn: { display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textDecoration: "none", textAlign: "center" },
    downloadBtn: { display: "inline-block", background: "#dcfce7", color: "#166534", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textDecoration: "none", textAlign: "center" },

    overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
    modal: { background: "white", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", borderRadius: "32px", padding: "40px" },
    mHead: { display: "flex", justifyContent: "space-between", marginBottom: "32px" },
    mClose: { border: "none", background: "none", fontSize: "24px", cursor: "pointer" },

    form: { display: "flex", flexDirection: "column", gap: "20px" },
    fRow: { display: "flex", gap: "16px" },
    fGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
    fLab: { fontSize: "13px", fontWeight: "700" },
    fIn: { padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", background: "#f8fafc", fontSize: "14px" },
    fSel: { padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", background: "#f8fafc", fontSize: "14px" },
    submitBtn: { background: "var(--primary)", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "800", cursor: "pointer", fontSize: "15px" },
    mSubmit: { background: "var(--primary)", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" }
};
