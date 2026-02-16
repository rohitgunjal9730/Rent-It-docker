import { useState } from "react";
import { isEmail, isRequired } from "../utils/validators";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginUser } from "../services/authService";
import { loginSuccess } from "../redux/authSlice";

import { Link } from "react-router-dom";

function Login() {
  // ---------- State ----------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ---------- Handle Login ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call login API
      const response = await loginUser(email, password);

      // Normalize role
      const role = response.data.role
        .replace("ROLE_", "")
        .toUpperCase();

      // ✅ Save to Redux
      dispatch(
        loginSuccess({
          token: response.data.token,
          role: role,
          userId: response.data.userId,
        })
      );

      // ✅ Persist to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", response.data.userId);

      // Redirect user based on role
      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "CUSTOMER":
          navigate("/customer");
          break;
        case "OWNER":
          navigate("/owner");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data) {
        // Handle both string responses and object responses (e.g., { message: "..." })
        const errorMessage = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data.message || "Invalid email or password";
        setError(errorMessage);
      } else {
        setError("Invalid email or password");
      }
    }
  };

  // ---------- UI ----------
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        <div className="card p-3 p-md-4 shadow">
          <h3 className="text-center mb-3 mb-md-4">Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!isRequired(e.target.value)) setEmailError("Email is required.");
                  else if (!isEmail(e.target.value)) setEmailError("Please enter a valid email (e.g., name@example.com).");
                  else setEmailError("");
                }}
                required
              />
              {emailError && <small className="text-danger">{emailError}</small>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!isRequired(e.target.value)) setPasswordError("Password is required.");
                    else setPasswordError("");
                  }}
                  required
                />
                {passwordError && <small className="text-danger">{passwordError}</small>}
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mt-3 text-center">
              <Link to="/forgot-password" className="text-primary">
                Forgot Password?
              </Link>
            </div>
            <div>

            </div>
            {/* Submit */}
            <button type="submit" className="btn btn-dark w-100 mt-3" disabled={!!emailError || !!passwordError || !email || !password}>
              {(!email || !password || emailError || passwordError) ? "Enter valid credentials" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
