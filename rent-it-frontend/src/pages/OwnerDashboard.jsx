import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function OwnerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to vehicle list
    navigate("/owner/vehicles");
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}
export default OwnerDashboard;