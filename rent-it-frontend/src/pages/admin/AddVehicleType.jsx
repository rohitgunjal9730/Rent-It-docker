import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addVehicleType } from "../../api/VehicleTypeService";

function AddVehicleType() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        vehicleTypeName: "",
        rate: "",
        deposite: "",
        priceUnit: "PER_DAY"
    });

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

            await addVehicleType(data);
            setSuccess(true);

            // Show success message briefly then redirect
            setTimeout(() => {
                navigate("/admin/vehicle-types");
            }, 1500);

        } catch (err) {
            console.error("Error adding vehicle type:", err);

            // Handle different error types
            if (err.response?.status === 409) {
                setError("Vehicle type with this ID already exists");
            } else if (err.response?.status === 400) {
                setError(err.response.data?.error || "Validation failed");
            } else {
                setError("Failed to add vehicle type. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-plus-circle me-2"></i>
                Add New Vehicle Type
            </h2>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {success && (
                                <div className="alert alert-success">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Vehicle type added successfully! Redirecting...
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
                                        Vehicle Type ID <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="vehicleTypeId"
                                        name="vehicleTypeId"
                                        value={formData.vehicleTypeId}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        disabled={loading || success}
                                    />
                                    <small className="text-muted">Unique identifier for the vehicle type</small>
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
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>
                                                Add Vehicle Type
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

export default AddVehicleType;
