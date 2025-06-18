import { Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import Layout from "@/components/Layout";
import Login from "@/pages/Login/Login";
import Attendance from "@/pages/Attendance/AttendancePage";

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="attendance" element={<Attendance />} />
      </Route>
    </Routes>
  );
}
