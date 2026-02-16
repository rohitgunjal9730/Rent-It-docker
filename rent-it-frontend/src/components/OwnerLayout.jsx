import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

function OwnerLayout() {
    const location = useLocation();
    const { userId } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Helper function to check if link is active
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
            <h5 className="px-3 mb-3 text-primary">Owner Dashboard</h5>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link
                        className={`nav-link ${isActive("/owner/vehicles")}`}
                        to="/owner/vehicles"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-car-front me-2"></i>
                        My Vehicles
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link ${isActive("/owner/vehicles/add")}`}
                        to="/owner/vehicles/add"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Vehicle
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link ${isActive("/owner/bookings")}`}
                        to="/owner/bookings"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-calendar-check me-2"></i>
                        My Bookings
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link ${isActive("/owner/profile")}`}
                        to="/owner/profile"
                        onClick={handleLinkClick}
                    >
                        <i className="bi bi-person-circle me-2"></i>
                        My Profile
                    </Link>
                </li>
            </ul>

            <hr />

            <div className="px-3">
                <small className="text-muted">Quick Actions</small>
                <ul className="nav flex-column mt-2">
                    <li className="nav-item">
                        <span className="nav-link text-muted">
                            <i className="bi bi-pencil-square me-2"></i>
                            Update Vehicle
                            <br />
                            <small className="text-muted ms-4">
                                (Click Edit on any vehicle)
                            </small>
                        </span>
                    </li>
                </ul>
            </div>

            <hr />

            <div className="px-3 pb-3">
                <small className="text-muted">User Info</small>
                <p className="mb-1 mt-2">
                    <small>
                        <strong>Owner ID:</strong> {userId}
                    </small>
                </p>
            </div>
        </>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Mobile Header with Toggle Button */}
                <div className="d-md-none bg-light p-3 d-flex justify-content-between align-items-center border-bottom">
                    <h5 className="mb-0 text-primary">
                        <i className="bi bi-person-badge me-2"></i>
                        Owner Dashboard
                    </h5>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list fs-4"></i>
                    </button>
                </div>

                {/* Offcanvas Sidebar for Mobile */}
                <div className={`offcanvas offcanvas-start bg-light ${sidebarOpen ? 'show' : ''}`}
                    tabIndex="-1"
                    id="ownerSidebar"
                    style={{ visibility: sidebarOpen ? 'visible' : 'hidden' }}>
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title text-primary">
                            <i className="bi bi-person-badge me-2"></i>
                            Owner Menu
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
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
                <nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar"
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

export default OwnerLayout;
