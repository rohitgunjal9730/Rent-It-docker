import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleTypeById, editVehicleType } from "../../api/VehicleTypeService";

function EditVehicleType() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        vehicleTypeName: "",
        rate: "",
        deposite: "",
        priceUnit: "PER_DAY"
    });

    useEffect(() => {
        fetchVehicleType();
    }, [id]);

    const fetchVehicleType = async () => {
        try {
            setFetchLoading(true);
            const data = await getVehicleTypeById(id);

            setFormData({
                vehicleTypeId: data.vehicleTypeId,
                vehicleTypeName: data.vehicleTypeName,
                rate: data.rate,
                deposite: data.deposite,
                priceUnit: data.priceUnit
            });
            setError(null);
        } catch (err) {
            console.error("Error fetching vehicle type:", err);

            if (err.response?.status === 404) {
                setError("Vehicle type not found");
            } else {
                setError("Failed to fetch vehicle type details");
            }
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.vehicleTypeName.trim()) {
            setError("Vehicle type name cannot be empty");
            return;
        }

        if (parseFloat(formData.rate) <= 0) {
            setError("Rate must be greater than 0");
            return;
        }

        if (parseFloat(formData.deposite) < 0) {
            setError("Deposit must be greater than or equal to 0");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = {
                vehicleTypeId: parseInt(formData.vehicleTypeId),
                vehicleTypeName: formData.vehicleTypeName,
                rate: parseFloat(formData.rate),
                deposite: parseFloat(formData.deposite),
                priceUnit: formData.priceUnit
            };

            await editVehicleType(id, data);
            setSuccess(true);

            // Show success message briefly then redirect
            setTimeout(() => {
                navigate("/admin/vehicle-types");
            }, 1500);

        } catch (err) {
            console.error("Error updating vehicle type:", err);

            // Handle different error types
            if (err.response?.status === 404) {
                setError("Vehicle type not found");
            } else if (err.response?.status === 400) {
                setError(err.response.data?.error || "Validation failed");
            } else {
                setError("Failed to update vehicle type. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading vehicle type details...</p>
            </div>
        );
    }

    if (error && !formData.vehicleTypeId) {
        return (
            <div>
                <h2 className="mb-4">Edit Vehicle Type</h2>
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/vehicle-types")}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-pencil me-2"></i>
                Edit Vehicle Type - {formData.vehicleTypeName}
            </h2>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {success && (
                                <div className="alert alert-success">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Vehicle type updated successfully! Redirecting...
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="vehicleTypeId" className="form-label">
                                        Vehicle Type ID
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="vehicleTypeId"
                                        name="vehicleTypeId"
                                        value={formData.vehicleTypeId}
                                        readOnly
                                        disabled
                                    />
                                    <small className="text-muted">Vehicle type ID cannot be changed</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="vehicleTypeName" className="form-label">
                                        Vehicle Type Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="vehicleTypeName"
                                        name="vehicleTypeName"
                                        value={formData.vehicleTypeName}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Bike, Car, SUV"
                                        disabled={loading || success}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="rate" className="form-label">
                                            Rate <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">₹</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="rate"
                                                name="rate"
                                                value={formData.rate}
                                                onChange={handleChange}
                                                required
                                                min="0.01"
                                                step="0.01"
                                                placeholder="0.00"
                                                disabled={loading || success}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="deposite" className="form-label">
                                            Deposit <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">₹</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="deposite"
                                                name="deposite"
                                                value={formData.deposite}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                disabled={loading || success}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="priceUnit" className="form-label">
                                        Price Unit <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="priceUnit"
                                        name="priceUnit"
                                        value={formData.priceUnit}
                                        onChange={handleChange}
                                        required
                                        disabled={loading || success}
                                    >
                                        <option value="PER_DAY">Per Day</option>
                                        <option value="PER_HOUR">Per Hour</option>
                                    </select>
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate("/admin/vehicle-types")}
                                        disabled={loading || success}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || success}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>
                                                Update Vehicle Type
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditVehicleType;
