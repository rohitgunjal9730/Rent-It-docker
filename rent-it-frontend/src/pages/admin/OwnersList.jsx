import { useState, useEffect } from "react";
import api from "../../api/axios";

function OwnersList() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/users/owners");
            setOwners(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching owners:", err);
            setError("Failed to fetch owners");
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (userId, status) => {
        try {
            await api.put(`/admin/users/${userId}/approval`, {
                approvalStatus: status
            });
            alert(`User ${status} successfully!`);
            fetchOwners(); // Refresh the list
        } catch (err) {
            console.error("Error updating approval:", err);
            alert("Failed to update user approval");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <h2 className="mb-3 mb-md-4">
                <i className="bi bi-person-badge me-2"></i>
                Owners Management
            </h2>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Documents</th>
                                    <th>Status</th>
                                    <th>Approval</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">
                                            <i className="bi bi-inbox display-4 text-muted"></i>
                                            <p className="text-muted mt-2">No owners found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    owners.map((owner) => (
                                        <tr key={owner.userId}>
                                            <td>{owner.userId}</td>
                                            <td>
                                                {owner.fname} {owner.mname} {owner.lname}
                                            </td>
                                            <td>{owner.email}</td>
                                            <td>{owner.phone}</td>
                                            <td>
                                                {owner.areaName && owner.cityName
                                                    ? `${owner.areaName}, ${owner.cityName}`
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                <small>
                                                    DL: {owner.drivingLicenceNo || "N/A"}<br />
                                                    Aadhar: {owner.adharNo || "N/A"}
                                                </small>
                                            </td>
                                            <td>
                                                {owner.isActive === 'ACTIVE' ? (
                                                    <span className="badge bg-success">Online</span>
                                                ) : (
                                                    <span className="badge bg-danger">Offline</span>
                                                )}
                                            </td>
                                            <td>
                                                {owner.approvalStatus === "APPROVED" && (
                                                    <span className="badge bg-success">
                                                        <i className="bi bi-check-circle me-1"></i>
                                                        Approved
                                                    </span>
                                                )}
                                                {owner.approvalStatus === "PENDING" && (
                                                    <span className="badge bg-warning text-dark">
                                                        <i className="bi bi-clock me-1"></i>
                                                        Pending
                                                    </span>
                                                )}
                                                {owner.approvalStatus === "REJECTED" && (
                                                    <span className="badge bg-danger">
                                                        <i className="bi bi-x-circle me-1"></i>
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    {owner.approvalStatus !== "APPROVED" && (
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => handleApproval(owner.userId, "APPROVED")}
                                                            title="Approve"
                                                        >
                                                            <i className="bi bi-check-lg"></i>
                                                        </button>
                                                    )}
                                                    {owner.approvalStatus !== "REJECTED" && (
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleApproval(owner.userId, "REJECTED")}
                                                            title="Reject"
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <small className="text-muted">
                    Total Owners: {owners.length}
                </small>
            </div>
        </div>
    );
}

export default OwnersList;
