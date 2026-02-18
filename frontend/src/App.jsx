import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import RentalsPage from "./pages/RentalsPage";
import AvailableRooms from "./pages/AvailableRooms";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import RoomDetails from "./pages/RoomDetails";
import PaymentPage from "./pages/PaymentPage";
import ReservationSuccess from "./pages/ReservationSuccess";
import ProfilePage from "./pages/ProfilePage";
import ExperiencesPage from "./pages/ExperiencesPage";
import HelpPage from "./pages/HelpPage";
import AdminInvoicePage from "./pages/AdminInvoicePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/rooms" element={<AvailableRooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success/:id" element={<ReservationSuccess />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="/admin/invoice/:id" element={<AdminInvoicePage />} />
      <Route path="/rentals" element={<RentalsPage />} />
      <Route path="/help" element={<HelpPage />} />
    </Routes>
  );
}
