import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { logout } from "../redux/authSlice";
import api from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Get auth state from Redux
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout()); // clears Redux + localStorage
      navigate("/login");
      setIsOpen(false); // Close menu on logout
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Rent-It</Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>

            {/* ADMIN */}
            {isAuthenticated && role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>
              </li>
            )}

            {/* CUSTOMER */}
            {isAuthenticated && role === "CUSTOMER" && (
              <li className="nav-item">
                <Link className="nav-link" to="/customer" onClick={() => setIsOpen(false)}>Customer</Link>
              </li>
            )}

            {/* OWNER */}
            {isAuthenticated && role === "OWNER" && (
              <li className="nav-item">
                <Link className="nav-link" to="/owner" onClick={() => setIsOpen(false)}>Owner</Link>
              </li>
            )}

            {/* NOT LOGGED IN */}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                </li>
              </>
            )}

            {/* LOGGED IN */}
            {isAuthenticated && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
