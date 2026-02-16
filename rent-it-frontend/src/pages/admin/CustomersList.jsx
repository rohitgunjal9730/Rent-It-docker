import { useState, useEffect } from "react";
import api from "../../api/axios";

function CustomersList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/users/customers");
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching customers:", err);
            setError("Failed to fetch customers");
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
            fetchCustomers(); // Refresh the list
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
                <i className="bi bi-people me-2"></i>
                Customers Management
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
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">
                                            <i className="bi bi-inbox display-4 text-muted"></i>
                                            <p className="text-muted mt-2">No customers found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.userId}>
                                            <td>{customer.userId}</td>
                                            <td>
                                                {customer.fname} {customer.mname} {customer.lname}
                                            </td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td>
                                                {customer.areaName && customer.cityName
                                                    ? `${customer.areaName}, ${customer.cityName}`
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                <small>
                                                    DL: {customer.drivingLicenceNo || "N/A"}<br />
                                                    Aadhar: {customer.adharNo || "N/A"}
                                                </small>
                                            </td>
                                            <td>
                                                {customer.isActive === 'ACTIVE' ? (
                                                    <span className="badge bg-success">Online</span>
                                                ) : (
                                                    <span className="badge bg-danger">Offline</span>
                                                )}
                                            </td>
                                            <td>
                                                {customer.approvalStatus === "APPROVED" && (
                                                    <span className="badge bg-success">
                                                        <i className="bi bi-check-circle me-1"></i>
                                                        Approved
                                                    </span>
                                                )}
                                                {customer.approvalStatus === "PENDING" && (
                                                    <span className="badge bg-warning text-dark">
                                                        <i className="bi bi-clock me-1"></i>
                                                        Pending
                                                    </span>
                                                )}
                                                {customer.approvalStatus === "REJECTED" && (
                                                    <span className="badge bg-danger">
                                                        <i className="bi bi-x-circle me-1"></i>
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    {customer.approvalStatus !== "APPROVED" && (
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => handleApproval(customer.userId, "APPROVED")}
                                                            title="Approve"
                                                        >
                                                            <i className="bi bi-check-lg"></i>
                                                        </button>
                                                    )}
                                                    {customer.approvalStatus !== "REJECTED" && (
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleApproval(customer.userId, "REJECTED")}
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
                    Total Customers: {customers.length}
                </small>
            </div>
        </div>
    );
}

export default CustomersList;
