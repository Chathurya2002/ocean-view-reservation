import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Tesseract from "tesseract.js";
import Layout from "../components/Layout";
import { FaWifi, FaCoffee, FaTv, FaWind, FaBath, FaCreditCard, FaLock, FaCalendarAlt, FaArrowLeft, FaMapMarkerAlt, FaCar, FaBiking } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Mock Gallery Images based on room types
const MOCK_GALLERY = [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1591088398332-8a77d399ef84?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60"
];

export default function RoomDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        checkIn: searchParams.get("checkIn") || "",
        checkOut: searchParams.get("checkOut") || "",
        guests: searchParams.get("guests") || "1",
        paymentMethod: "CARD"
    });

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        whatsapp: "",
        contactNumber: "",
        idNumber: "",
        address: "",
        idImage: null
    });
    const [fullUser, setFullUser] = useState(null);
    const [isOcrLoading, setIsOcrLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);

    const [experiences, setExperiences] = useState([]);
    const [selectedExpIds, setSelectedExpIds] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [selectedRentalIds, setSelectedRentalIds] = useState([]);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/rooms/${id}`);
                setRoom(res.data);
            } catch (err) {
                console.error(err);
                alert("Room not found");
                navigate("/rooms");
            } finally {
                setLoading(false);
            }
        };

        const fetchExperiences = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/experiences`);
                setExperiences(res.data);
            } catch (err) {
                console.error("Error fetching experiences:", err);
            }
        };

        const fetchRentals = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/rentals`);
                setRentals(res.data);
            } catch (err) {
                console.error("Error fetching rentals:", err);
            }
        };

        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFullUser(res.data);
                    setProfileForm({
                        whatsapp: res.data.whatsapp || "",
                        contactNumber: res.data.contactNumber || "",
                        idNumber: res.data.idNumber || "",
                        address: res.data.address || "",
                        idImage: null
                    });
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                }
            }
        };

        fetchRoom();
        fetchExperiences();
        fetchRentals();
        fetchUser();
    }, [id, navigate]);

    const calculateTotal = () => {
        if (!room || !bookingData.checkIn || !bookingData.checkOut) return { nights: 0, total: 0, roomTotal: 0, expTotal: 0, rentalTotal: 0 };
        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nights = diffDays > 0 ? diffDays : 1;
        const roomTotal = nights * room.price;

        const expTotal = experiences
            .filter(exp => selectedExpIds.includes((exp._id || exp.id)))
            .reduce((sum, exp) => sum + exp.price, 0);

        const rentalTotal = rentals
            .filter(rental => selectedRentalIds.includes((rental._id || rental.id)))
            .reduce((sum, rental) => sum + rental.price, 0);

        return { nights, total: roomTotal + expTotal + rentalTotal, roomTotal, expTotal, rentalTotal };
    };

    const { nights, total, roomTotal, expTotal, rentalTotal } = calculateTotal();

    const toggleExperience = (expId) => {
        setSelectedExpIds(prev =>
            prev.includes(expId)
                ? prev.filter(id => id !== expId)
                : [...prev, expId]
        );
    };

    const toggleRental = (rentalId) => {
        setSelectedRentalIds(prev =>
            prev.includes(rentalId)
                ? prev.filter(id => id !== rentalId)
                : [...prev, rentalId]
        );
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            alert("Please login to reserve a room");
            navigate("/"); // Updated to home
            return;
        }

        const userObj = JSON.parse(storedUser);
        if (userObj.role === "admin") {
            alert("⚠️ Usage Restriction: Admins cannot make personal reservations.");
            return;
        }

        // Check if profile is complete
        const isProfileIncomplete = !fullUser?.whatsapp || !fullUser?.contactNumber || !fullUser?.idNumber || !fullUser?.idImage || !fullUser?.address;

        if (isProfileIncomplete) {
            setShowProfileModal(true);
            return;
        }

        proceedToBooking();
    };

    const proceedToBooking = async () => {
        if (bookingData.paymentMethod === "CARD") {
            // Redirect to Payment Page
            navigate(`/payment?roomId=${(room._id || room.id)}&checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&guests=${bookingData.guests}&amount=${total}&experienceIds=${selectedExpIds.join(",")}&rentalIds=${selectedRentalIds.join(",")}`);
        } else {
            // BANK or Cash Payment (Pay at Property)
            const token = localStorage.getItem("token");
            await createReservation(token);
        }
    };

    const createReservation = async (token) => {
        try {
            const payload = {
                room: (room._id || room.id),
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                paymentMethod: bookingData.paymentMethod,
                guests: bookingData.guests,
                price: total,
                experiences: selectedExpIds,
                rentals: selectedRentalIds,
                paymentReceipt: bookingData.paymentReceipt ? "uploaded_receipt_pending_implementation.jpg" : null
            };

            const res = await axios.post(`${API_URL}/api/reservations`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            navigate(`/success/${(res.data._id || res.data.id)}`);
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("whatsapp", profileForm.whatsapp);
        formData.append("contactNumber", profileForm.contactNumber);
        formData.append("idNumber", profileForm.idNumber);
        if (profileForm.idImage) {
            formData.append("idImage", profileForm.idImage);
        }

        try {
            formData.append("address", profileForm.address);

            const res = await axios.put(`${API_URL}/api/auth/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setFullUser(res.data.user);
            setShowProfileModal(false);
            alert("Profile details updated! Continuing your booking...");
            // Automatically proceed to booking after detail update
            if (bookingData.paymentMethod === "CARD") {
                navigate(`/payment?roomId=${(room._id || room.id)}&checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&guests=${bookingData.guests}&amount=${total}&experienceIds=${selectedExpIds.join(",")}&rentalIds=${selectedRentalIds.join(",")}`);
            } else {
                await createReservation(token);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update profile details");
        }
    };

    const handleOcr = async (file) => {
        if (!file) return;
        setIsOcrLoading(true);
        setOcrProgress(0);

        try {
            const { data: { text } } = await Tesseract.recognize(
                file,
                "eng",
                {
                    logger: m => {
                        if (m.status === "recognizing text") {
                            setOcrProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            console.log("OCR Extracted Text:", text);

            // Simple parsing logic (Sri Lankan ID / Normal Alphanumeric ID)
            // 9-12 digits or specific alphanumeric patterns
            const idPattern = /\b\d{9,12}[VvXx]?\b/;
            const foundId = text.match(idPattern);

            if (foundId) {
                setProfileForm(prev => ({ ...prev, idNumber: foundId[0] }));
                alert(`Detected ID Number: ${foundId[0]}`);
            }

            // Attempt to find a name-like string (very basic)
            // Looking for "NAME" or "FULL NAME" or "IDENTITY CARD" followers
            const lines = text.split("\n").map(l => l.trim().toUpperCase());
            const nameLabels = ["NAME", "FULL NAME", "OWNER", "GUEST"];

            for (let i = 0; i < lines.length; i++) {
                if (nameLabels.some(label => lines[i].includes(label))) {
                    const nextLine = lines[i + 1];
                    if (nextLine && nextLine.length > 3) {
                        // Potential name found on the next line
                        // Note: This is a best effort and might be wrong depending on the ID
                    }
                }
            }

        } catch (err) {
            console.error("OCR Error:", err);
        } finally {
            setIsOcrLoading(false);
            setOcrProgress(0);
        }
    };


    if (loading) return <Layout><div style={styles.loader}>Tailoring your view...</div></Layout>;
    if (!room) return null;

    return (
        <Layout>
            <div style={styles.page}>
                <div style={styles.container}>

                    {/* HEADER NAVIGATION */}
                    <div style={styles.topNav}>
                        <button onClick={() => navigate(-1)} style={styles.backLink}><FaArrowLeft size={12} /> Back to Results</button>
                        <div style={styles.shareRow}>
                            <span style={styles.locationTag}><FaMapMarkerAlt /> Galle, Hikkaduwa, Sri Lanka</span>
                        </div>
                    </div>

                    {/* MODERN OVERLAPPING GALLERY */}
                    <div style={styles.galleryGrid}>
                        <div style={{ ...styles.mainImage, backgroundImage: `url(${room.image})` }} />
                        <div style={styles.sideGallery}>
                            <div style={{ ...styles.smallImage, backgroundImage: `url(${MOCK_GALLERY[0]})` }} />
                            <div style={{ ...styles.smallImage, backgroundImage: `url(${MOCK_GALLERY[1]})` }}>
                                <div style={styles.moreOverlay}>+12 Photos</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.layoutBody}>
                        {/* LEFT CONTENT */}
                        <div style={styles.leftCol}>
                            <header style={styles.header}>
                                <div style={styles.typeTag}>{room.type} CATEGORY • ROOM #{room.roomNumber}</div>
                                <h1 style={styles.roomName}>{room.name}</h1>
                                <p style={styles.summaryText}>Experience the ultimate luxury in our {room.name}, featuring panoramic views and world-class amenities.</p>
                            </header>

                            <section style={styles.section}>
                                <h3 style={styles.sectionTitle}>Room Experience</h3>
                                <p style={styles.roomDesc}>{room.desc}</p>
                            </section>

                            <section style={styles.section}>
                                <h3 style={styles.sectionTitle}>Premium Facilities</h3>
                                <div style={styles.facGrid}>
                                    <div style={styles.facItem}><FaWifi color="var(--primary)" /> <span>High-Speed Internet</span></div>
                                    <div style={styles.facItem}><FaCoffee color="var(--primary)" /> <span>Breakfast Buffet</span></div>
                                    <div style={styles.facItem}><FaTv color="var(--primary)" /> <span>Smart Entertainment</span></div>
                                    <div style={styles.facItem}><FaWind color="var(--primary)" /> <span>Climate Control</span></div>
                                    <div style={styles.facItem}><FaBath color="var(--primary)" /> <span>Pool & Rain Shower</span></div>
                                </div>
                            </section>

                            <section style={styles.section}>
                                <h3 style={styles.sectionTitle}>Guest Policy</h3>
                                <div style={styles.policyGrid}>
                                    <div style={styles.polItem}><strong>Check-in:</strong> 2:00 PM</div>
                                    <div style={styles.polItem}><strong>Check-out:</strong> 11:00 AM</div>
                                    <div style={styles.polItem}><strong>Cancellation:</strong> Flexible</div>
                                </div>
                            </section>

                            {/* EXTRA EXPERIENCES SECTION */}
                            <section style={styles.section}>
                                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div>
                                        <h3 style={styles.sectionTitle}>Enhance Your Stay</h3>
                                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '-15px' }}>Curated local trips & activities in the Galle area.</p>
                                    </div>
                                    <span style={styles.tagCount}>{selectedExpIds.length} Selected</span>
                                </header>
                                <div style={styles.expGrid}>
                                    {experiences.map(exp => (
                                        <div key={(exp._id || exp.id)}
                                            style={{
                                                ...styles.expCard,
                                                borderColor: selectedExpIds.includes((exp._id || exp.id)) ? 'var(--primary)' : 'var(--border)',
                                                background: selectedExpIds.includes((exp._id || exp.id)) ? 'var(--primary-light)' : 'white'
                                            }}
                                            onClick={() => toggleExperience((exp._id || exp.id))}
                                        >
                                            <div style={{ ...styles.expImg, backgroundImage: `url(${exp.image})` }} />
                                            <div style={styles.expContent}>
                                                <div style={styles.expHeader}>
                                                    <span style={styles.expCat}>{exp.category}</span>
                                                    <span style={styles.expDuration}>{exp.duration}</span>
                                                </div>
                                                <h4 style={styles.expName}>{exp.name}</h4>
                                                <p style={styles.expDesc}>{exp.desc}</p>
                                                <div style={styles.expFooter}>
                                                    <span style={styles.expPrice}>LKR {exp.price.toLocaleString()}</span>
                                                    <button style={{
                                                        ...styles.addBtn,
                                                        background: selectedExpIds.includes((exp._id || exp.id)) ? 'var(--primary)' : 'transparent',
                                                        color: selectedExpIds.includes((exp._id || exp.id)) ? 'white' : 'var(--primary)'
                                                    }}>
                                                        {selectedExpIds.includes((exp._id || exp.id)) ? 'Selected' : '+ Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* RENTALS SECTION */}
                            <section style={styles.section}>
                                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div>
                                        <h3 style={styles.sectionTitle}>Rent a Vehicle</h3>
                                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '-15px' }}>Explore the surroundings with our premium fleet.</p>
                                    </div>
                                    <span style={styles.tagCount}>{selectedRentalIds.length} Selected</span>
                                </header>
                                <div style={styles.expGrid}>
                                    {rentals.map(rental => (
                                        <div key={(rental._id || rental.id)}
                                            style={{
                                                ...styles.expCard,
                                                borderColor: selectedRentalIds.includes((rental._id || rental.id)) ? 'var(--primary)' : 'var(--border)',
                                                background: selectedRentalIds.includes((rental._id || rental.id)) ? 'var(--primary-light)' : 'white'
                                            }}
                                            onClick={() => toggleRental((rental._id || rental.id))}
                                        >
                                            <div style={{ ...styles.expImg, backgroundImage: `url(${rental.image})` }} />
                                            <div style={styles.expContent}>
                                                <div style={styles.expHeader}>
                                                    <span style={styles.expCat}>
                                                        {rental.type === "Vehicle" ? <FaCar size={10} /> : <FaBiking size={10} />} {rental.type}
                                                    </span>
                                                </div>
                                                <h4 style={styles.expName}>{rental.name}</h4>
                                                <p style={styles.expDesc}>{rental.description}</p>
                                                <div style={styles.expFooter}>
                                                    <span style={styles.expPrice}>LKR {rental.price.toLocaleString()}</span>
                                                    <button style={{
                                                        ...styles.addBtn,
                                                        background: selectedRentalIds.includes((rental._id || rental.id)) ? 'var(--primary)' : 'transparent',
                                                        color: selectedRentalIds.includes((rental._id || rental.id)) ? 'white' : 'var(--primary)'
                                                    }}>
                                                        {selectedRentalIds.includes((rental._id || rental.id)) ? 'Selected' : '+ Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR: BOOKING CARD */}
                        <div style={styles.sidebar}>
                            <div style={styles.reserveCard}>
                                <div style={styles.priceRow}>
                                    <div>
                                        <span style={styles.priceLg}>LKR {room.price.toLocaleString()}</span>
                                        <span style={styles.unitText}>/night</span>
                                    </div>
                                    <div style={styles.ratingBrief}>★ 9.2</div>
                                </div>

                                <form onSubmit={handleBooking} style={styles.form}>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}><FaCalendarAlt /> Check-in</label>
                                        <input type="date" required style={styles.input} value={bookingData.checkIn} onChange={e => setBookingData({ ...bookingData, checkIn: e.target.value })} />
                                    </div>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}><FaCalendarAlt /> Check-out</label>
                                        <input type="date" required style={styles.input} value={bookingData.checkOut} onChange={e => setBookingData({ ...bookingData, checkOut: e.target.value })} />
                                    </div>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}><FaCreditCard /> Payment</label>
                                        <select style={styles.select} value={bookingData.paymentMethod} onChange={e => setBookingData({ ...bookingData, paymentMethod: e.target.value })}>
                                            <option value="CARD">Debit / Credit Card</option>
                                            <option value="BANK">Bank Transfer (Upload Receipt Below)</option>
                                            <option value="CASH">Pay at Property</option>
                                        </select>
                                    </div>

                                    {(bookingData.paymentMethod === "BANK" || bookingData.paymentMethod === "CARD") && (
                                        <div style={styles.inputWrapper}>
                                            <label style={styles.lab}>Payment Receipt (Optional for Card)</label>
                                            <input
                                                type="file"
                                                style={styles.fileInput}
                                                onChange={e => setBookingData({ ...bookingData, paymentReceipt: e.target.files[0] })}
                                                accept="image/*,application/pdf"
                                            />
                                        </div>
                                    )}

                                    <div style={styles.priceSummary}>
                                        <div style={styles.sumRow}><span>{nights} Night{nights !== 1 ? 's' : ''} Amount</span><span>LKR {roomTotal.toLocaleString()}</span></div>
                                        {selectedExpIds.length > 0 && (
                                            <div style={styles.sumRow}><span>Experiences Add-ons ({selectedExpIds.length})</span><span>LKR {expTotal.toLocaleString()}</span></div>
                                        )}
                                        <div style={styles.sumRow}><span>Resort Fees</span><span>LKR 0</span></div>
                                        {selectedRentalIds.length > 0 && (
                                            <div style={styles.sumRow}><span>Rental Add-ons ({selectedRentalIds.length})</span><span>LKR {rentalTotal.toLocaleString()}</span></div>
                                        )}
                                        <div style={styles.totalRow}><span>Total Price</span><span>LKR {total.toLocaleString()}</span></div>
                                    </div>

                                    <button type="submit" style={styles.reserveBtn}>
                                        Confirm Reservation <FaLock size={12} style={{ marginLeft: 8 }} />
                                    </button>
                                    <p style={styles.footerNote}>Prices inclusive of all taxes.</p>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* PROFILE COMPLETION MODAL */}
                    {showProfileModal && (
                        <div style={styles.modalOverlay}>
                            <div style={styles.modalContent}>
                                <h2 style={styles.modalTitle}>Complete Your Profile</h2>
                                <p style={styles.modalSub}>Required to process your reservation at Ocean View Resort.</p>
                                <form onSubmit={handleProfileSubmit} style={styles.modalForm}>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}>WhatsApp Number</label>
                                        <input type="text" required style={styles.input} value={profileForm.whatsapp} onChange={e => setProfileForm({ ...profileForm, whatsapp: e.target.value })} placeholder="+94 77 123 4567" />
                                    </div>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}>Contact Number</label>
                                        <input type="text" required style={styles.input} value={profileForm.contactNumber} onChange={e => setProfileForm({ ...profileForm, contactNumber: e.target.value })} placeholder="0771234567" />
                                    </div>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}>Home Address (Passport Address)</label>
                                        <input type="text" required style={styles.input} value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} placeholder="123 Ocean Street, Hikkaduwa, Galle" />
                                    </div>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}>ID / Passport Number</label>
                                        <input type="text" required style={styles.input} value={profileForm.idNumber} onChange={e => setProfileForm({ ...profileForm, idNumber: e.target.value })} placeholder="199512345V" />
                                    </div>
                                    <div style={styles.inputWrapper}>
                                        <label style={styles.lab}>ID / Passport Photo</label>
                                        <div style={styles.ocrContainer}>
                                            <input
                                                type="file"
                                                required={!fullUser?.idImage}
                                                style={styles.fileInput}
                                                onChange={e => {
                                                    const file = e.target.files[0];
                                                    setProfileForm({ ...profileForm, idImage: file });
                                                    handleOcr(file);
                                                }}
                                                accept="image/*"
                                            />
                                            {isOcrLoading && (
                                                <div style={styles.ocrSpinner}>
                                                    <div style={{ ...styles.progressBar, width: `${ocrProgress}%` }} />
                                                    <span style={styles.ocrProgressText}>Scanning ID: {ocrProgress}%</span>
                                                </div>
                                            )}
                                        </div>
                                        {fullUser?.idImage && <p style={{ fontSize: "10px", color: "green" }}>✓ Current ID Image exists</p>}
                                    </div>
                                    <div style={styles.modalActions}>
                                        <button type="button" onClick={() => setShowProfileModal(false)} style={styles.cancelBtn}>Cancel</button>
                                        <button type="submit" style={styles.saveBtn}>Save and Continue</button>
                                    </div>
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
    page: { background: "#fff", minHeight: "100vh", paddingBottom: "100px" },
    container: { maxWidth: "1200px", margin: "0 auto", padding: "0 24px" },
    loader: { height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "var(--text-dim)" },

    topNav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" },
    backLink: { background: "none", border: "none", color: "var(--text-dim)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" },
    locationTag: { fontSize: "12px", fontWeight: "800", color: "var(--primary)", background: "var(--primary-light)", padding: "6px 14px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "6px" },

    galleryGrid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", height: "480px", marginBottom: "40px" },
    mainImage: { borderRadius: "24px", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
    sideGallery: { display: "grid", gridTemplateRows: "1fr 1fr", gap: "16px" },
    smallImage: { borderRadius: "20px", backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden" },
    moreOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", cursor: "pointer" },

    layoutBody: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "60px" },

    leftCol: { paddingTop: "20px" },
    typeTag: { fontSize: "11px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1px", marginBottom: "12px" },
    roomName: { fontSize: "36px", fontWeight: "900", color: "var(--secondary)", marginBottom: "16px", letterSpacing: "-1px" },
    summaryText: { fontSize: "16px", color: "var(--text-dim)", lineHeight: "1.6", maxWidth: "600px", marginBottom: "40px" },

    section: { marginBottom: "48px", borderBottom: "1px solid #f1f5f9", paddingBottom: "40px" },
    sectionTitle: { fontSize: "18px", fontWeight: "800", marginBottom: "20px", color: "var(--secondary)" },
    roomDesc: { fontSize: "14px", color: "#64748b", lineHeight: "1.8" },

    facGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    facItem: { display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", color: "var(--secondary)" },

    policyGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
    polItem: { fontSize: "13px", color: "var(--text-dim)", fontWeight: "600" },

    sidebar: { position: "sticky", top: "120px", alignSelf: "start" },
    reserveCard: { background: "white", borderRadius: "32px", padding: "32px", border: "1px solid var(--border)", boxShadow: "0 25px 50px rgba(0,0,0,0.06)" },
    priceRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px" },
    priceLg: { fontSize: "28px", fontWeight: "900", color: "var(--secondary)" },
    unitText: { fontSize: "13px", fontWeight: "700", color: "var(--text-dim)", marginLeft: "4px" },
    ratingBrief: { background: "var(--secondary)", color: "white", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "800" },

    form: { display: "flex", flexDirection: "column", gap: "16px" },
    inputWrapper: { display: "flex", flexDirection: "column", gap: "8px" },
    lab: { fontSize: "12px", fontWeight: "800", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "8px" },
    input: { padding: "14px 16px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "14px", fontWeight: "600", outline: "none" },
    select: { padding: "14px 16px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "14px", fontWeight: "600", outline: "none", cursor: "pointer" },

    priceSummary: { background: "#f8fafc", padding: "20px", borderRadius: "20px", marginTop: "12px" },
    sumRow: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-dim)", fontWeight: "600", marginBottom: "10px" },
    totalRow: { display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "900", color: "var(--secondary)", borderTop: "1px dashed #cbd5e1", paddingTop: "12px", marginTop: "4px" },

    // Experiences Styles
    expGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' },
    expCard: { display: 'flex', gap: '16px', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', padding: '12px' },
    expImg: { width: '120px', height: '120px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '14px', flexShrink: 0 },
    expContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
    expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    expCat: { fontSize: '10px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' },
    expDuration: { fontSize: '10px', color: 'var(--text-dim)', fontWeight: '600' },
    expName: { fontSize: '15px', fontWeight: '800', color: 'var(--secondary)' },
    expDesc: { fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.4' },
    expFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' },
    expPrice: { fontSize: '14px', fontWeight: '800', color: 'var(--secondary)' },
    addBtn: { border: '1px solid var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' },
    tagCount: { background: 'var(--secondary)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '800' },

    reserveBtn: { background: "var(--primary)", color: "white", padding: "18px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: "800", cursor: "pointer", transition: "all 0.2s", marginTop: "8px" },
    footerNote: { textAlign: "center", fontSize: "11px", color: "#94a3b8", fontWeight: "700", marginTop: "12px" },

    // Modal Styles
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalContent: { background: "white", padding: "40px", borderRadius: "32px", width: "100%", maxWidth: "450px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" },
    modalTitle: { fontSize: "24px", fontWeight: "900", margin: "0 0 8px 0" },
    modalSub: { fontSize: "14px", color: "var(--text-dim)", marginBottom: "24px" },
    modalForm: { display: "flex", flexDirection: "column", gap: "16px" },
    fileInput: { padding: "10px", borderRadius: "12px", border: "1px dashed #cbd5e1", fontSize: "12px" },
    modalActions: { display: "flex", gap: "12px", marginTop: "10px" },
    cancelBtn: { flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "white", fontWeight: "700", cursor: "pointer" },
    saveBtn: { flex: 2, padding: "14px", borderRadius: "14px", border: "none", background: "var(--primary)", color: "white", fontWeight: "800", cursor: "pointer" },

    ocrContainer: { position: "relative" },
    ocrSpinner: { marginTop: "10px", background: "#f1f5f9", borderRadius: "8px", height: "24px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
    progressBar: { position: "absolute", left: 0, top: 0, height: "100%", background: "var(--primary)", transition: "0.4s", opacity: 0.2 },
    ocrProgressText: { fontSize: "10px", fontWeight: "800", color: "var(--primary)", zIndex: 1 }
};
