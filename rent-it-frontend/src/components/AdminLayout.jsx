import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

function AdminLayout() {
    const location = useLocation();
    const { userId, isAuthenticated } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Helper function to check if link is active
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    // Check token presence in localStorage for an extra layer of verification
    const tokenPresent = !!localStorage.getItem("token");

    // Close sidebar when link is clicked (for mobile)
    const handleLinkClick = () => {
        setSidebarOpen(false);
    };

    // Sidebar content component (reused for both mobile and desktop)
    const SidebarContent = () => (
        <>
            <h5 className="px-3 mb-3 text-warning">
                <i className="bi bi-shield-check me-2"></i>
                Admin Panel
            </h5>

            <hr className="text-white" />

            {/* User Management Section */}
            <div className="px-3 mb-2">
                <small className="text-muted">USER MANAGEMENT</small>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link
                        className={`nav-link text-white ${isActive("/admin/users/customers")}`}
                        to="/admin/users/customers"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-people me-2"></i>
                        Customers
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link text-white ${isActive("/admin/users/owners")}`}
                        to="/admin/users/owners"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-person-badge me-2"></i>
                        Owners
                    </Link>
                </li>
            </ul>

            <hr className="text-white" />

            {/* Vehicle Management Section */}
            <div className="px-3 mb-2">
                <small className="text-muted">VEHICLE MANAGEMENT</small>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link
                        className={`nav-link text-white ${isActive("/admin/vehicles")}`}
                        to="/admin/vehicles"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-car-front-fill me-2"></i>
                        All Vehicles
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link text-white ${isActive("/admin/vehicle-types")}`}
                        to="/admin/vehicle-types"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-tags me-2"></i>
                        Vehicle Types
                    </Link>
                </li>
            </ul>

            <hr className="text-white" />

            {/* Dashboard Link */}
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link
                        className={`nav-link text-white ${isActive("/admin")}`}
                        to="/admin"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link text-white ${isActive("/admin/analytics")}`}
                        to="/admin/analytics"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-bar-chart-line me-2"></i>
                        Analytics
                    </Link>
                </li>
            </ul>

            <hr className="text-white" />

            {/* Admin Info */}
            <div className="px-3 pb-3">
                <small className="text-muted">ADMIN INFO</small>
                <p className="mb-1 mt-2">
                    <small className="text-white">
                        <strong>Admin ID:</strong> {userId}
                    </small>
                </p>

                {/* Token status badge */}
                <p className="mb-0 mt-1">
                    <small className={`badge ${isAuthenticated && tokenPresent ? 'bg-success' : 'bg-danger'}`}>
                        {isAuthenticated && tokenPresent ? '🔒 Token present' : '🔓 No token'}
                    </small>
                </p>
            </div>
        </>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Mobile Header with Toggle Button */}
                <div className="d-md-none bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-warning">
                        <i className="bi bi-shield-check me-2"></i>
                        Admin Panel
                    </h5>
                    <button
                        className="btn btn-outline-light btn-sm"
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list fs-4"></i>
                    </button>
                </div>

                {/* Offcanvas Sidebar for Mobile */}
                <div className={`offcanvas offcanvas-start bg-dark text-white ${sidebarOpen ? 'show' : ''}`} 
                     tabIndex="-1" 
                     id="adminSidebar"
                     style={{ visibility: sidebarOpen ? 'visible' : 'hidden' }}>
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title text-warning">
                            <i className="bi bi-shield-check me-2"></i>
                            Admin Menu
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body p-0">
                        <div className="pt-3">
                            <SidebarContent />
                        </div>
                    </div>
                </div>

                {/* Backdrop for mobile offcanvas */}
                {sidebarOpen && (
                    <div 
                        className="offcanvas-backdrop fade show" 
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Fixed Sidebar for Desktop */}
                <nav className="col-md-3 col-lg-2 d-none d-md-block bg-dark text-white sidebar" 
                     style={{ height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
                    <div className="pt-3">
                        <SidebarContent />
                    </div>
                </nav>

                {/* Main Content */}
                <main className="col-12 col-md-9 ms-md-auto col-lg-10 px-3 px-md-4 py-3 py-md-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
