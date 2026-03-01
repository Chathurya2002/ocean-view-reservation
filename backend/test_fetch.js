const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/offers", {
    headers: { Authorization: `Bearer ${token}` }
})
    .then(res => res.json())
    .then(data => console.log("Offers fetch result:", data))
    .catch(err => console.error("Offers fetch failed:", err));
