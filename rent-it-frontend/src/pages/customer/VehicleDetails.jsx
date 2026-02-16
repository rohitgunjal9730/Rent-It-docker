import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function VehicleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchVehicleDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchVehicleDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/customer/vehicles/${id}`);
            console.log("✅ Vehicle details fetched:", response.data);
            setVehicle(response.data);
        } catch (err) {
            console.error("❌ Error fetching vehicle details:", err);
            if (err.response?.status === 404) {
                setError("Vehicle not found or not available.");
            } else {
                setError("Failed to load vehicle details. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading vehicle details...</p>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error || "Vehicle not found."}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/customer/vehicles")}>
                        Back to Vehicles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button className="btn btn-outline-secondary mb-3 mb-md-4" onClick={() => navigate("/customer/vehicles")}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Vehicles
            </button>

            <div className="row g-3 g-md-4">
                {/* Images Section */}
                <div className="col-12 col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            {/* Main Image */}
                            {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? (
                                <>
                                    <img
                                        src={`data:image/jpeg;base64,${vehicle.vehicleImages[selectedImage]?.imageData}`}
                                        className="img-fluid rounded mb-3"
                                        alt={vehicle.vehicleName}
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                    {/* Thumbnail Images */}
                                    {vehicle.vehicleImages.length > 1 && (
                                        <div className="d-flex gap-2 overflow-auto">
                                            {vehicle.vehicleImages.map((img, index) => (
                                                <img
                                                    key={img.imageId}
                                                    src={`data:image/jpeg;base64,${img.imageData}`}
                                                    className={`img-thumbnail ${index === selectedImage ? "border-primary" : ""}`}
                                                    alt={`${vehicle.vehicleName} - ${index + 1}`}
                                                    style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                                                    onClick={() => setSelectedImage(index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div
                                    className="bg-secondary d-flex align-items-center justify-content-center rounded"
                                    style={{ height: "400px" }}
                                >
                                    <i className="bi bi-car-front text-white" style={{ fontSize: "5rem" }}></i>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="col-12 col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">{vehicle.vehicleName}</h2>
                            <p className="text-muted">{vehicle.brand} - {vehicle.model}</p>

                            <div className="mb-3">
                                <span className="badge bg-primary me-2">{vehicle.vehicleType}</span>
                                <span className="badge bg-info text-dark me-2">{vehicle.fuelType}</span>
                                {vehicle.hasAC && <span className="badge bg-success me-2">AC</span>}
                                <span className="badge bg-secondary">{vehicle.availabilityStatus}</span>
                            </div>

                            <div className="alert alert-success">
                                <h4 className="mb-0">₹{vehicle.pricePerDay} / {vehicle.priceUnit}</h4>
                                <small>Security Deposit: ₹{vehicle.deposit}</small>
                            </div>

                            <h5 className="mt-4">Vehicle Details</h5>
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <th>Registration Number:</th>
                                        <td>{vehicle.registrationNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>RC Number:</th>
                                        <td>{vehicle.rcNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>AC Available:</th>
                                        <td>{vehicle.hasAC ? "Yes" : "No"}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {vehicle.description && (
                                <>
                                    <h5 className="mt-4">Description</h5>
                                    <p>{vehicle.description}</p>
                                </>
                            )}

                            <h5 className="mt-4">Owner Information</h5>
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <th>Name:</th>
                                        <td>{vehicle.owner?.ownerName}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone:</th>
                                        <td>{vehicle.owner?.ownerPhoneNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{vehicle.owner?.ownerEmail}</td>
                                    </tr>
                                    <tr>
                                        <th>Location:</th>
                                        <td>
                                            {vehicle.owner?.address?.area}, {vehicle.owner?.address?.city} - {vehicle.owner?.address?.pincode}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Verification:</th>
                                        <td>
                                            <span className={`badge ${vehicle.owner?.verificationStatus === "APPROVED" ? "bg-success" : "bg-warning"}`}>
                                                {vehicle.owner?.verificationStatus}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <button
                                className="btn btn-success btn-lg w-100 mt-4"
                                onClick={() => navigate(`/customer/book/${id}`)}
                            >
                                <i className="bi bi-calendar-check me-2"></i>
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleDetails;
