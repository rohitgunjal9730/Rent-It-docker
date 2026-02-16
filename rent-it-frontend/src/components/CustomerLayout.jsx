import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";

function CustomerLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    // Close sidebar when link is clicked (for mobile)
    const handleLinkClick = () => {
        setSidebarOpen(false);
    };

    // Sidebar content component (reused for both mobile and desktop)
    const SidebarContent = () => (
        <>
            <h4 className="mb-4 px-3 text-primary">Customer Panel</h4>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <Link
                        to="/customer"
                        className={`nav-link text-white ${isActive("/customer")}`}
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link
                        to="/customer/vehicles"
                        className={`nav-link text-white ${isActive("/customer/vehicles")}`}
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-car-front me-2"></i>
                        Browse Vehicles
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link
                        to="/customer/bookings"
                        className={`nav-link text-white ${isActive("/customer/bookings")}`}
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-calendar-check me-2"></i>
                        My Bookings
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link
                        to="/customer/profile"
                        className={`nav-link text-white ${isActive("/customer/profile")}`}
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-person-circle me-2"></i>
                        Profile
                    </Link>
                </li>
            </ul>
        </>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Mobile Header with Toggle Button */}
                <div className="d-md-none bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-primary">
                        <i className="bi bi-person-circle me-2"></i>
                        Customer Panel
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
                    id="customerSidebar"
                    style={{ visibility: sidebarOpen ? 'visible' : 'hidden' }}>
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title text-primary">
                            <i className="bi bi-person-circle me-2"></i>
                            Customer Menu
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
                    <div className="p-3">
                        <SidebarContent />
                    </div>
                </nav>

                {/* Main Content */}
                <div className="col-12 col-md-9 ms-md-auto col-lg-10 px-3 px-md-4 py-3 py-md-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default CustomerLayout;
