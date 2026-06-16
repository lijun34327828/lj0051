import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import MyBookings from "@/pages/MyBookings";
import { Navbar } from "@/components/Navbar";
import { StarryBackground } from "@/components/StarryBackground";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        <StarryBackground density={0.6} />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <footer className="relative z-10 border-t border-cosmos-900/50 py-4 text-center text-xs text-slate-500">
            © 2026 星空天文台 · Starlight Observatory
          </footer>
        </div>
      </div>
    </Router>
  );
}
