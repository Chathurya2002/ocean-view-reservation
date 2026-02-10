import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AvailableRooms() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => ({
    checkIn: params.get("checkIn") || "",
    checkOut: params.get("checkOut") || "",
    adults: params.get("adults") || "2",
    children: params.get("children") || "0",
    roomType: params.get("roomType") || "",
  }), [params]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/rooms/available`, { params: query });
        setRooms(res.data || []);
      } catch (e) {
        alert(e.response?.data?.message || "Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [query]);

  const reserve = (room) => {
    alert(`Reserve clicked: ${room.name}`);
    // next step: POST /api/reservations (user id + room id + dates)
  };

  return (
    <div style={{ minHeight: "100vh", padding: 30, background: "#0b1220", color: "white" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: 12 }}>← Back</button>
      <h2>Available Rooms</h2>

      {loading && <p>Loading...</p>}

      {!loading && rooms.length === 0 && <p>No rooms available.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {rooms.map((r) => (
          <div key={r._id} style={{ background: "white", color: "#111", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 150, background: "#ddd" }}>
              {/* image optional */}
              {r.image && <img src={r.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>

            <div style={{ padding: 12 }}>
              <h3 style={{ margin: "0 0 6px" }}>{r.name}</h3>
              <p style={{ margin: "0 0 6px" }}>Type: {r.type}</p>
              <p style={{ margin: "0 0 10px" }}>Price: LKR {r.price}</p>

              <button
                onClick={() => reserve(r)}
                style={{ width: "100%", background: "#0071c2", color: "white", border: 0, padding: 10, borderRadius: 10, cursor: "pointer" }}
              >
                Reserve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
