import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import {
    fetchVehicleDetails,
    updateVehicleDescription,
    uploadMultipleVehicleImages,
    deleteVehicleImage,
    setPrimaryImage
} from "../../services/VehicleService";

// Validation helpers
import { isRequired, fileIsImageType, fileSizeUnder } from "../../utils/validators";

function EditVehicle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId } = useSelector((state) => state.auth);

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [vehicle, setVehicle] = useState(null);
    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        modelId: "",
        fuelTypeId: "",
        vehicleNumber: "",
        vehicleRcNumber: "",
        ac: 0,
        description: "",
    });

    const [images, setImages] = useState([]); // Existing images from backend
    const [newImages, setNewImages] = useState([]); // New images to upload
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0); // For new images
    const [errors, setErrors] = useState({});
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    useEffect(() => {
        loadDropdownData();
        loadVehicle();
    }, []);

    const loadDropdownData = async () => {
        try {
            const vtRes = await api.get("/owner/vehicletypes");
            setVehicleTypes(vtRes.data);

            const brandRes = await api.get("/owner/brands");
            setBrands(brandRes.data);

            const fuelRes = await api.get("/owner/fueltypes");
            setFuelTypes(fuelRes.data);
        } catch (err) {
            setError("Failed to load form data");
            console.error(err);
        }
    };

    const loadVehicle = async () => {
        try {
            setLoading(true);
            // Fetch comprehensive vehicle details including all images
            const vehicleData = await fetchVehicleDetails(id);

            if (vehicleData) {
                // Normalize data to handle potential PascalCase/camelCase differences
                const normalizedVehicle = {
                    vehicleId: vehicleData.vehicleId || vehicleData.VehicleId,
                    vehicleTypeId: vehicleData.vehicleTypeId || vehicleData.VehicleTypeId,
                    brandId: vehicleData.brandId || vehicleData.BrandId,
                    modelId: vehicleData.modelId || vehicleData.ModelId,
                    fuelTypeId: vehicleData.fuelTypeId || vehicleData.FuelTypeId,
                    vehicleNumber: vehicleData.vehicleNumber || vehicleData.VehicleNumber,
                    vehicleRcNumber: vehicleData.vehicleRcNumber || vehicleData.VehicleRcNumber,
                    ac: (vehicleData.ac !== undefined) ? vehicleData.ac : vehicleData.Ac,
                    description: vehicleData.description || vehicleData.Description || "",
                    primaryImage: vehicleData.primaryImage || vehicleData.PrimaryImage,
                    images: vehicleData.images || vehicleData.Images || []
                };

                setVehicle(normalizedVehicle);
                setImages(normalizedVehicle.images);

                // Populate form data
                setFormData({
                    vehicleTypeId: normalizedVehicle.vehicleTypeId || "",
                    modelId: normalizedVehicle.modelId || "",
                    fuelTypeId: normalizedVehicle.fuelTypeId || "",
                    vehicleNumber: normalizedVehicle.vehicleNumber || "",
                    vehicleRcNumber: normalizedVehicle.vehicleRcNumber || "",
                    ac: normalizedVehicle.ac || 0,
                    description: normalizedVehicle.description || "",
                });

                // Load models for the brand
                if (normalizedVehicle.brandId) {
                    const modelRes = await api.get(`/owner/models/brand/${normalizedVehicle.brandId}`);
                    setModels(modelRes.data);
                }
            }
        } catch (err) {
            setError("Failed to load vehicle details. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Brand change handler (just keeping it for compatibility, though field is read-only)
    const handleBrandChange = async (e) => {
        // Read-only in edit mode
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const invalid = [];
        const accepted = [];
        files.forEach(f => {
            if (!fileIsImageType(f)) invalid.push(`${f.name}: invalid file type`);
            else if (!fileSizeUnder(f, MAX_IMAGE_SIZE)) invalid.push(`${f.name}: file too large (max 5MB)`);
            else accepted.push(f);
        });

        if (invalid.length > 0) setErrors(prev => ({ ...prev, newImages: invalid.join('; ') }));
        else setErrors(prev => ({ ...prev, newImages: '' }));

        setNewImages(accepted);
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            setLoading(true);
            await deleteVehicleImage(imageId);
            setSuccess("Image deleted successfully");
            loadVehicle(); // Reload to see changes
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete image");
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimary = async (imageId) => {
        try {
            setLoading(true);
            await setPrimaryImage(id, imageId);
            setSuccess("Primary image updated successfully");
            loadVehicle(); // Reload to see changes
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update primary image");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate description
        if (!isRequired(formData.description)) {
            setErrors(prev => ({ ...prev, description: 'Description is required.' }));
            setError('Please fix validation errors before saving.');
            return;
        }

        // Validate new images if present
        if (errors.newImages) {
            setError('Please remove or replace invalid image files.');
            return;
        }

        setLoading(true);

        try {
            // 1. Update description only
            await updateVehicleDescription(id, formData.description);

            // 2. Upload new images if any
            if (newImages.length > 0) {
                const formDataImg = new FormData();
                newImages.forEach((file) => {
                    formDataImg.append("Images", file);
                });
                formDataImg.append("PrimaryImageIndex", primaryImageIndex);

                await uploadMultipleVehicleImages(id, formDataImg);

                // Clear file input
                setNewImages([]);
                document.getElementById('newImagesInput').value = '';

                // Reload vehicle data to show new images
                await loadVehicle();
            }

            setSuccess("Vehicle updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update vehicle");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                    <hr />
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/owner/vehicles")}
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && !vehicle.vehicleId) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-4">
            <h2 className="mb-3 mb-md-4">Edit Vehicle</h2>

            <div className="card shadow-sm">
                <div className="card-header">
                    <h3 className="mb-0">Edit Vehicle</h3>
                </div>
                <div className="card-body p-3 p-md-4">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="alert alert-info">
                        Note: You can only edit the description and manage images. Other details are read-only.
                    </div>

                    <form onSubmit={handleUpdate}>
                        <h5 className="mb-3">Vehicle Details</h5>

                        <div className="row g-3">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Vehicle Type</label>
                                <select
                                    className="form-select"
                                    name="vehicleTypeId"
                                    value={formData.vehicleTypeId}
                                    disabled
                                >
                                    <option value="">Select Vehicle Type</option>
                                    {vehicleTypes.map((vt) => (
                                        <option key={vt.vehicleTypeId} value={vt.vehicleTypeId}>
                                            {vt.vehicleTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Brand</label>
                                <select
                                    className="form-select"
                                    value={vehicle.brandId}
                                    disabled
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map((brand) => (
                                        <option
                                            key={brand.brandId}
                                            value={brand.brandId}
                                        >
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Model</label>
                                <select
                                    className="form-select"
                                    name="modelId"
                                    value={formData.modelId}
                                    disabled
                                >
                                    <option value="">Select Model</option>
                                    {models.map((model) => (
                                        <option key={model.modelId} value={model.modelId}>
                                            {model.modelName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Fuel Type</label>
                                <select
                                    className="form-select"
                                    name="fuelTypeId"
                                    value={formData.fuelTypeId}
                                    disabled
                                >
                                    <option value="">Select Fuel Type</option>
                                    {fuelTypes.map((ft) => (
                                        <option key={ft.fuelTypeId} value={ft.fuelTypeId}>
                                            {ft.fuelTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Vehicle Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.vehicleNumber}
                                    readOnly
                                    disabled
                                />
                            </div>

                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">RC Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.vehicleRcNumber}
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Air Conditioning</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        checked={formData.ac === 1}
                                        disabled
                                    />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        checked={formData.ac === 0}
                                        disabled
                                    />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description (Editable)</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                name="description"
                                placeholder="Enter vehicle description"
                                value={formData.description}
                                onChange={(e) => {
                                    handleChange(e);
                                    setErrors(prev => ({ ...prev, description: isRequired(e.target.value) ? '' : 'Description is required.' }));
                                }}
                            ></textarea>
                            {errors.description && <small className="text-danger">{errors.description}</small>}
                        </div>

                        <hr />

                        <h5 className="mb-3">Manage Images</h5>

                        <div className="row g-3 mb-4">
                            {images.map((img) => (
                                <div key={img.vehicleImageId} className="col-12 col-sm-6 col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="position-relative">
                                            <img
                                                src={`data:image/jpeg;base64,${img.image}`}
                                                className="card-img-top"
                                                alt="Vehicle"
                                                style={{ height: "180px", objectFit: "cover" }}
                                            />
                                            {img.isPrimary && (
                                                <span className="position-absolute top-0 start-0 badge bg-success m-2">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <div className="card-body p-2 d-flex justify-content-between">
                                            {!img.isPrimary && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleSetPrimary(img.vehicleImageId)}
                                                    disabled={loading}
                                                >
                                                    Set Primary
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger ms-auto"
                                                onClick={() => handleDeleteImage(img.vehicleImageId)}
                                                disabled={loading || images.length <= 1}
                                                title={images.length <= 1 ? "Cannot delete the last image" : "Delete image"}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h5 className="mb-3">Upload New Images</h5>
                        <div className="mb-3">
                            <input
                                id="newImagesInput"
                                type="file"
                                className="form-control"
                                accept="image/jpeg,image/jpg,image/png"
                                multiple
                                onChange={handleImageChange}
                            />
                            {errors.newImages && <small className="text-danger">{errors.newImages}</small>}
                            <small className="text-muted">
                                Upload additional images. You can select multiple files.
                            </small>
                        </div>

                        {newImages.length > 0 && (
                            <div className="mb-3">
                                <label className="form-label">Select Primary (for new images only if no existing primary)</label>
                                <div className="row g-3">
                                    {newImages.map((img, index) => (
                                        <div key={index} className="col-6 col-md-3 mb-2">
                                            <div className="card h-100">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    className="card-img-top"
                                                    alt="Preview"
                                                    style={{ height: "120px", objectFit: "cover" }}
                                                />
                                                <div className="card-body p-2 text-center">
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="primaryNewImage"
                                                            checked={primaryImageIndex === index}
                                                            onChange={() => setPrimaryImageIndex(index)}
                                                        />
                                                        <label className="form-check-label small text-truncate d-block" style={{ maxWidth: "100%" }}>
                                                            {img.name}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/owner/vehicles")}
                                disabled={loading}
                            >
                                Back to List
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditVehicle;
