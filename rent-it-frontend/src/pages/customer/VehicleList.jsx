import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function VehicleList() {
    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVehicleTypes();
        fetchVehicles();
    }, []);

    const fetchVehicleTypes = async () => {
        try {
            console.log("🚀 Frontend: Fetching vehicle types from /customer/vehicle-types");
            const response = await api.get("/customer/vehicle-types");
            console.log("✅ Frontend: Vehicle types received:", response.data);

            if (Array.isArray(response.data)) {
                setVehicleTypes(response.data);
            } else {
                console.error("❌ Frontend: Unexpected vehicle types format:", response.data);
            }
        } catch (err) {
            console.error("❌ Frontend: Error fetching vehicle types:", err);
            // Don't set error state here, we can still show vehicles even if types fail
        }
    };

    const fetchVehicles = async (vehicleTypeId = null) => {
        try {
            setLoading(true);
            setError(null);

            const url = vehicleTypeId
                ? `/customer/vehicles?vehicleTypeId=${vehicleTypeId}`
                : "/customer/vehicles";

            console.log(`🚀 Frontend: Fetching vehicles from ${url}`);
            const response = await api.get(url);
            console.log("✅ Frontend: API Response received:", response);
            console.log("✅ Frontend: Data payload:", response.data);

            if (Array.isArray(response.data)) {
                console.log(`✅ Frontend: Loaded ${response.data.length} vehicles`);
                setVehicles(response.data);
            } else {
                console.error("❌ Frontend: Unexpected response format (expected array):", response.data);
                setError("Received invalid data format from server.");
            }
        } catch (err) {
            console.error("❌ Frontend: Error fetching vehicles:", err);
            if (err.response) {
                console.error("❌ frontend: Server responded with:", err.response.status, err.response.data);
            }
            setError("Failed to load vehicles. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleTypeChange = (e) => {
        const selectedId = e.target.value;
        setSelectedVehicleTypeId(selectedId);

        // If empty string (All Vehicle Types), pass null to fetch all vehicles
        fetchVehicles(selectedId === "" ? null : selectedId);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading vehicles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                    <button className="btn btn-danger" onClick={() => fetchVehicles()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-3">
                <h1 className="mb-0">Browse Vehicles</h1>
                <div className="w-100 w-md-auto" style={{ minWidth: '200px', maxWidth: '300px' }}>
                    <select
                        className="form-select"
                        value={selectedVehicleTypeId}
                        onChange={handleVehicleTypeChange}
                        aria-label="Select vehicle type"
                    >
                        <option value="">All Vehicle Types</option>
                        {vehicleTypes.map((type) => (
                            <option key={type.vehicleTypeId} value={type.vehicleTypeId}>
                                {type.vehicleTypeName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {vehicles.length === 0 ? (
                <div className="alert alert-info">
                    <h5 className="alert-heading">No Vehicles Available</h5>
                    <p className="mb-0">
                        {selectedVehicleTypeId === ""
                            ? "There are no active vehicles at the moment. Please check back later."
                            : `No vehicles are currently available for the selected type.`}
                    </p>
                </div>
            ) : (
                <div className="row g-3 g-md-4">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.vehicleId} className="col-12 col-sm-6 col-lg-4">
                            <div className="card h-100 shadow-sm">
                                {/* Vehicle Image */}
                                {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? (
                                    <img
                                        src={`data:image/jpeg;base64,${vehicle.vehicleImages.find((img) => img.primary)?.imageData ||
                                            vehicle.vehicleImages[0]?.imageData
                                            }`}
                                        className="card-img-top"
                                        alt={vehicle.vehicleName}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ height: "200px" }}
                                    >
                                        <i className="bi bi-car-front text-white" style={{ fontSize: "3rem" }}></i>
                                    </div>
                                )}

                                <div className="card-body">
                                    <h5 className="card-title">{vehicle.vehicleName}</h5>
                                    <p className="card-text text-muted small">
                                        {vehicle.brand} - {vehicle.model}
                                    </p>

                                    <div className="mb-2">
                                        <span className="badge bg-primary me-2">{vehicle.vehicleType}</span>
                                        <span className="badge bg-info text-dark me-2">{vehicle.fuelType}</span>
                                        {vehicle.hasAC && <span className="badge bg-success">AC</span>}
                                    </div>

                                    <div className="mb-2">
                                        <strong className="text-success">
                                            ₹{vehicle.pricePerDay} / {vehicle.priceUnit}
                                        </strong>
                                        <br />
                                        <small className="text-muted">Deposit: ₹{vehicle.deposit}</small>
                                    </div>

                                    <p className="card-text small">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {vehicle.owner?.address?.city}
                                    </p>

                                    <Link
                                        to={`/customer/vehicles/${vehicle.vehicleId}`}
                                        className="btn btn-primary w-100"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VehicleList;
