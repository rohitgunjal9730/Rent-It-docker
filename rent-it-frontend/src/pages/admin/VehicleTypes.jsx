import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllVehicleTypes } from "../../api/VehicleTypeService";

function VehicleTypes() {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVehicleTypes();
    }, []);

    const fetchVehicleTypes = async () => {
        try {
            setLoading(true);
            const data = await getAllVehicleTypes();
            setVehicleTypes(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching vehicle types:", err);
            setError("Failed to fetch vehicle types");
        } finally {
            setLoading(false);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-tags me-2"></i>
                    Vehicle Types Management
                </h2>
                <Link to="/admin/vehicle-types/add" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Vehicle Type
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Rate</th>
                                    <th>Deposit</th>
                                    <th>Price Unit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicleTypes.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <i className="bi bi-inbox display-4 text-muted"></i>
                                            <p className="text-muted mt-2">No vehicle types found</p>
                                            <Link to="/admin/vehicle-types/add" className="btn btn-sm btn-primary">
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Add First Vehicle Type
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    vehicleTypes.map((type) => (
                                        <tr key={type.vehicleTypeId}>
                                            <td>{type.vehicleTypeId}</td>
                                            <td>
                                                <strong>{type.vehicleTypeName}</strong>
                                            </td>
                                            <td>₹{type.rate.toFixed(2)}</td>
                                            <td>₹{type.deposite.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${type.priceUnit === 'PER_DAY' ? 'bg-info' : 'bg-success'}`}>
                                                    {type.priceUnit === 'PER_DAY' ? 'Per Day' : 'Per Hour'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/admin/vehicle-types/edit/${type.vehicleTypeId}`}
                                                    className="btn btn-sm btn-warning"
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil me-1"></i>
                                                    Edit
                                                </Link>
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
                    Total Vehicle Types: {vehicleTypes.length}
                </small>
            </div>
        </div>
    );
}

export default VehicleTypes;
