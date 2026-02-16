import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVehicleDetails } from "../../services/VehicleService";

function ViewVehicle() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % v.images.length);
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + v.images.length) % v.images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage(e);
            if (e.key === "ArrowLeft") prevImage(e);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, vehicle]);

    useEffect(() => {
        loadVehicle();
    }, []);

    const loadVehicle = async () => {
        try {
            setLoading(true);
            const data = await fetchVehicleDetails(id);
            setVehicle(data);
        } catch (err) {
            setError("Failed to load vehicle details.");
            console.error(err);
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
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>Error</h4>
                    <p>{error}</p>
                    <button className="btn btn-secondary" onClick={() => navigate("/owner/vehicles")}>
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    if (!vehicle) return null;

    const v = {
        brand: vehicle.brandName || vehicle.BrandName,
        model: vehicle.modelName || vehicle.ModelName,
        type: vehicle.vehicleTypeName || vehicle.VehicleTypeName,
        fuel: vehicle.fuelTypeName || vehicle.FuelTypeName,
        number: vehicle.vehicleNumber || vehicle.VehicleNumber,
        rc: vehicle.vehicleRcNumber || vehicle.VehicleRcNumber,
        ac: (vehicle.ac !== undefined) ? vehicle.ac : vehicle.Ac,
        desc: vehicle.description || vehicle.Description,
        status: vehicle.status || vehicle.Status,
        images: vehicle.images || vehicle.Images || []
    };

    return (
        <div className="pb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
                <h2 className="mb-0">Vehicle Details</h2>
                <button className="btn btn-secondary" onClick={() => navigate("/owner/vehicles")}>
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to List
                </button>
            </div>

            <div className="row g-3 g-md-4">
                {/* Left Column: Details */}
                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">info</h5>
                        </div>
                        <div className="card-body">
                            <h4 className="card-title mb-3">{v.brand} {v.model}</h4>

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Status:</strong>
                                    <span className={`badge ${v.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                                        {v.status}
                                    </span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Vehicle Number:</strong>
                                    <span>{v.number}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>RC Number:</strong>
                                    <span>{v.rc}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Type:</strong>
                                    <span>{v.type}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Fuel:</strong>
                                    <span>{v.fuel}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>AC:</strong>
                                    <span>{v.ac === 1 ? "Yes" : "No"}</span>
                                </li>
                            </ul>

                            <div className="mt-4">
                                <h6>Description</h6>
                                <p className="text-muted border p-2 rounded bg-light">
                                    {v.desc || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Images */}
                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Gallery ({v.images.length})</h5>
                        </div>
                        <div className="card-body">
                            {v.images.length === 0 ? (
                                <p className="text-muted text-center py-5">No images uploaded.</p>
                            ) : (
                                <div className="row g-2">
                                    {v.images.map((img, idx) => (
                                        <div key={idx} className="col-6 col-md-4">
                                            <div
                                                className="position-relative"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => openLightbox(idx)}
                                                title="Click to view full screen"
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${img.image}`}
                                                    className="img-fluid rounded border"
                                                    alt={`Vehicle ${idx + 1}`}
                                                    style={{ height: "150px", width: "100%", objectFit: "cover" }}
                                                />
                                                {img.isPrimary === 1 && (
                                                    <span className="position-absolute top-0 start-0 badge bg-primary m-1">
                                                        Primary
                                                    </span>
                                                )}
                                                {/* Hover indication */}
                                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-10 opacity-0 hover-opacity-100 text-white" style={{ transition: "opacity 0.2s" }}>
                                                    <span className="badge bg-dark rounded-pill px-3 py-2">🔍 View</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {lightboxOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 9999 }}
                    onClick={closeLightbox}
                >
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 m-4 text-decoration-none"
                        style={{ fontSize: "3rem", lineHeight: 1 }}
                        onClick={closeLightbox}
                    >
                        &times;
                    </button>

                    <button
                        className="btn btn-link text-white position-absolute start-0 ms-4"
                        style={{ fontSize: "3rem", textDecoration: "none" }}
                        onClick={prevImage}
                    >
                        &#10094;
                    </button>

                    <div className="text-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`data:image/jpeg;base64,${v.images[currentImageIndex].image}`}
                            style={{ maxHeight: "85vh", maxWidth: "90vw", objectFit: "contain" }}
                            className="shadow"
                            alt="Full View"
                        />
                        <div className="text-white mt-3 fs-5">
                            {currentImageIndex + 1} / {v.images.length}
                        </div>
                    </div>

                    <button
                        className="btn btn-link text-white position-absolute end-0 me-4"
                        style={{ fontSize: "3rem", textDecoration: "none" }}
                        onClick={nextImage}
                    >
                        &#10095;
                    </button>
                </div>
            )}
        </div>
    );
}

export default ViewVehicle;
