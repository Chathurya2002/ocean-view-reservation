import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import AvailableRooms from "./pages/AvailableRooms"; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/rooms" element={<AvailableRooms />} />
    </Routes>
  );
}
