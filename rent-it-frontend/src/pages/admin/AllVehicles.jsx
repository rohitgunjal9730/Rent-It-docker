import { useState, useEffect } from "react";
import api from "../../api/axios";


function AllVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/vehicles");
            setVehicles(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            setError("Failed to fetch vehicles");
        } finally {
            setLoading(false);
        }
    };

    const handleBlockVehicle = async (vehicleId) => {
        if (!confirm("Are you sure you want to block this vehicle?")) return;

        try {
            await api.put(`/admin/vehicles/${vehicleId}/block`);
            alert("Vehicle blocked successfully!");
            fetchVehicles(); // Refresh the list
        } catch (err) {
            console.error("Error blocking vehicle:", err);
            alert("Failed to block vehicle");
        }
    };

    const handleUnblockVehicle = async (vehicleId) => {
        if (!confirm("Are you sure you want to unblock this vehicle?")) return;

        try {
            await api.put(`/admin/vehicles/${vehicleId}/unblock`);
            alert("Vehicle unblocked successfully!");
            fetchVehicles(); // Refresh the list
        } catch (err) {
            console.error("Error unblocking vehicle:", err);
            alert("Failed to unblock vehicle");
        }
    };

    const getImageSrc = (imageData) => {
        if (!imageData) return null;
        return `data:image/jpeg;base64,${imageData}`;
    };

    // Filter vehicles based on status
    const filteredVehicles = vehicles.filter(vehicle => {
        if (filterStatus === "ALL") return true;
        return vehicle.status === filterStatus;
    });

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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-3">
                <h2 className="mb-0">
                    <i className="bi bi-car-front-fill me-2"></i>
                    All Vehicles
                </h2>

                {/* Status Filter */}
                <div className="btn-group w-100 w-md-auto" role="group">
                    <button
                        className={`btn btn-sm ${filterStatus === "ALL" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilterStatus("ALL")}
                    >
                        All ({vehicles.length})
                    </button>
                    <button
                        className={`btn btn-sm ${filterStatus === "ACTIVE" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFilterStatus("ACTIVE")}
                    >
                        Active ({vehicles.filter(v => v.status === "ACTIVE").length})
                    </button>
                    <button
                        className={`btn btn-sm ${filterStatus === "BLOCKED" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setFilterStatus("BLOCKED")}
                    >
                        Blocked ({vehicles.filter(v => v.status === "BLOCKED").length})
                    </button>
                </div>
            </div>

            {filteredVehicles.length === 0 ? (
                <div className="alert alert-info text-center py-5">
                    <i className="bi bi-inbox display-4"></i>
                    <p className="mt-3 mb-0">No vehicles found for the selected filter</p>
                </div>
            ) : (
                <div className="row g-3 g-md-4">
                    {filteredVehicles.map((vehicle) => (
                        <div key={vehicle.vehicleId} className="col-12 col-sm-6 col-lg-4">
                            <div className="card h-100 shadow-sm">
                                {/* Vehicle Image */}
                                {vehicle.isPrimaryImage && vehicle.image ? (
                                    <img
                                        src={getImageSrc(vehicle.image)}
                                        className="card-img-top"
                                        alt={vehicle.vehicleNumber}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ height: "200px" }}
                                    >
                                        <i className="bi bi-car-front display-3 text-white"></i>
                                    </div>
                                )}

                                <div className="card-body">
                                    {/* Vehicle Number & Status */}
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="card-title mb-0">{vehicle.vehicleNumber}</h5>
                                        {vehicle.status === "ACTIVE" ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-danger">Blocked</span>
                                        )}
                                    </div>

                                    {/* Vehicle Details */}
                                    <p className="card-text">
                                        <strong>Type:</strong> {vehicle.vehicleTypeName}<br />
                                        <strong>Brand:</strong> {vehicle.brandName}<br />
                                        <strong>Model:</strong> {vehicle.modelName}<br />
                                        <strong>Fuel:</strong> {vehicle.fuelTypeName || "N/A"}<br />
                                        <strong>AC:</strong> {vehicle.ac ? "Yes" : "No"}<br />
                                        <strong>RC Number:</strong> {vehicle.vehicleRcNumber || "N/A"}
                                    </p>

                                    <hr />

                                    {/* Owner Details */}
                                    <div className="mb-3">
                                        <small className="text-muted">OWNER DETAILS</small>
                                        <p className="mb-0 mt-1">
                                            <strong>{vehicle.ownerName}</strong><br />
                                            <small>
                                                <i className="bi bi-envelope me-1"></i>{vehicle.ownerEmail}<br />
                                                <i className="bi bi-phone me-1"></i>{vehicle.ownerPhone}
                                            </small>
                                        </p>
                                    </div>

                                    {/* Description */}
                                    {vehicle.description && (
                                        <p className="card-text">
                                            <small className="text-muted">{vehicle.description}</small>
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-grid gap-2">
                                        {vehicle.status === "ACTIVE" ? (
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleBlockVehicle(vehicle.vehicleId)}
                                            >
                                                <i className="bi bi-ban me-2"></i>
                                                Block Vehicle
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleUnblockVehicle(vehicle.vehicleId)}
                                            >
                                                <i className="bi bi-check-circle me-2"></i>
                                                Unblock Vehicle
                                            </button>
                                        )}
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

export default AllVehicles;
