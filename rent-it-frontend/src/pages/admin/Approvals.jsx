import { useEffect, useState } from "react";
import api from "../../api/axios";

function Approvals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/vehicles/pending");
      setPending(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load pending vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm("Approve this vehicle?")) return;
    try {
      await api.put(`/admin/vehicles/${id}/approve`);
      alert("Vehicle approved.");
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("Failed to approve vehicle.");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason (optional):");
    if (reason === null) return; // cancelled
    try {
      await api.put(`/admin/vehicles/${id}/reject`, reason ? { reason } : {});
      alert("Vehicle rejected.");
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("Failed to reject vehicle.");
    }
  };

  if (loading) return <div className="text-center py-5">Loading pending vehicles...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-3 mb-md-4">Pending Vehicle Approvals</h2>

      {pending.length === 0 ? (
        <div className="alert alert-info">No pending vehicles.</div>
      ) : (
        <div className="row g-3">
          {pending.map((v) => (
            <div className="col-12 col-md-6 mb-3 mb-md-4" key={v.vehicleId}>
              <div className="card h-100 shadow-sm">
                {v.imageBase64 ? (
                  <img src={`data:image/jpeg;base64,${v.imageBase64}`} className="card-img-top" alt={v.vehicleNumber} style={{ height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div className="card-img-top bg-secondary d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    <i className="bi bi-car-front display-3 text-white"></i>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{v.vehicleNumber}</h5>
                  <p className="card-text">{v.description}</p>

                  <small className="text-muted">Owner: {v.ownerName} ({v.ownerEmail})</small>

                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-success" onClick={() => handleApprove(v.vehicleId)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handleReject(v.vehicleId)}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Approvals;
