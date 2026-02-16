import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

import AdminDashboard from "../pages/AdminDashboard";
import OwnerDashboard from "../pages/OwnerDashboard";
import CustomerDashboard from "../pages/CustomerDashboard";

// Owner vehicle pages
import OwnerVehicleList from "../pages/owner/VehicleList";
import AddVehicle from "../pages/owner/AddVehicle";
import EditVehicle from "../pages/owner/EditVehicle";
import ViewVehicle from "../pages/owner/ViewVehicle";
import OwnerBookings from "../pages/owner/OwnerBookings";
import OwnerProfile from "../pages/owner/OwnerProfile";
import OwnerLayout from "../components/OwnerLayout";

// Admin pages
import CustomersList from "../pages/admin/CustomersList";
import OwnersList from "../pages/admin/OwnersList";
import AllVehicles from "../pages/admin/AllVehicles";
import Approvals from "../pages/admin/Approvals";
import Analytics from "../pages/admin/Analytics";
import VehicleTypes from "../pages/admin/VehicleTypes";
import AddVehicleType from "../pages/admin/AddVehicleType";
import EditVehicleType from "../pages/admin/EditVehicleType";
import AdminLayout from "../components/AdminLayout";

// Customer pages
import CustomerVehicleList from "../pages/customer/VehicleList";
import VehicleDetails from "../pages/customer/VehicleDetails";
import MyBookings from "../pages/customer/MyBookings";
import CreateBooking from "../pages/customer/CreateBooking";
import CustomerProfile from "../pages/customer/CustomerProfile";
import CustomerPaymentHistory from "../pages/customer/CustomerPaymentHistory";
import CustomerLayout from "../components/CustomerLayout";

import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/ForgotPassword";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* CUSTOMER - All routes use CustomerLayout with sidebar */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes - will render inside CustomerLayout's <Outlet /> */}
          <Route index element={<CustomerDashboard />} />
          <Route path="vehicles" element={<CustomerVehicleList />} />
          <Route path="vehicles/:id" element={<VehicleDetails />} />
          <Route path="book/:vehicleId" element={<CreateBooking />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="payments/history" element={<CustomerPaymentHistory />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        {/* ADMIN - All routes use AdminLayout with sidebar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes - will render inside AdminLayout's <Outlet /> */}
          <Route index element={<AdminDashboard />} />
          <Route path="users/customers" element={<CustomersList />} />
          <Route path="users/owners" element={<OwnersList />} />
          <Route path="vehicles" element={<AllVehicles />} />
          <Route path="vehicles/pending" element={<Approvals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="vehicle-types" element={<VehicleTypes />} />
          <Route path="vehicle-types/add" element={<AddVehicleType />} />
          <Route path="vehicle-types/edit/:id" element={<EditVehicleType />} />
        </Route>

        {/* OWNER - All routes use OwnerLayout with sidebar */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes - will render inside OwnerLayout's <Outlet /> */}
          <Route index element={<OwnerDashboard />} />
          <Route path="vehicles" element={<OwnerVehicleList />} />
          <Route path="vehicles/add" element={<AddVehicle />} />
          <Route path="vehicles/edit/:id" element={<EditVehicle />} />
          <Route path="vehicles/view/:id" element={<ViewVehicle />} />
          <Route path="bookings" element={<OwnerBookings />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
