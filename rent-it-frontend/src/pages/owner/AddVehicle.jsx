import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { addVehicle, uploadMultipleVehicleImages } from "../../services/VehicleService";

// Validation helpers
import { isRequired, vehicleNumberIsValid, rcNumberIsValid, fileIsImageType, fileSizeUnder } from "../../utils/validators";

function AddVehicle() {
    const navigate = useNavigate();
    const { userId } = useSelector((state) => state.auth);

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);

    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        modelId: "",
        fuelTypeId: "",
        vehicleNumber: "",
        vehicleRcNumber: "",
        ac: 0,
        description: "",
    });

    const [images, setImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Inline validation errors
    const [errors, setErrors] = useState({});

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

    useEffect(() => {
        loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
        try {
            console.log("🔍 Starting to load dropdown data...");

            // Fetch vehicle types
            console.log("📞 Calling: GET /vehicletypes");
            const vtRes = await api.get("/owner/vehicletypes");
            console.log("✅ Vehicle Types Response:", vtRes.data);
            setVehicleTypes(vtRes.data);

            // Fetch brands
            console.log("📞 Calling: GET /brands");
            const brandRes = await api.get("/owner/brands");
            console.log("✅ Brands Response:", brandRes.data);
            setBrands(brandRes.data);

            // Fetch fuel types
            console.log("📞 Calling: GET /fueltypes");
            const fuelRes = await api.get("/owner/fueltypes");
            console.log("✅ Fuel Types Response:", fuelRes.data);
            setFuelTypes(fuelRes.data);

            console.log("✅ All dropdown data loaded successfully!");
        } catch (err) {
            console.error("❌ ERROR loading form data:");
            console.error("Error message:", err.message);
            console.error("Error response:", err.response);
            console.error("Full error:", err);
            setError("Failed to load form data");
        }
    };

    const handleBrandChange = async (e) => {
        const brandId = e.target.value;
        console.log("🏷️ Brand changed to:", brandId);
        // store selected brand in formData for validation and submission
        setFormData(prev => ({ ...prev, brandId, modelId: "" }));
        setErrors(prev => ({ ...prev, brandId: brandId ? "" : "Please select a brand." }));
        if (brandId) {
            try {
                console.log(`📞 Calling: GET /models/brand/${brandId}`);
                const res = await api.get(`/owner/models/brand/${brandId}`);
                console.log("✅ Models Response:", res.data);
                setModels(res.data);
            } catch (err) {
                console.error("❌ Error loading models:", err);
            }
        } else {
            setModels([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // live validation
        if (name === "vehicleNumber") {
            if (!isRequired(value)) setErrors(prev => ({ ...prev, vehicleNumber: "Vehicle number is required." }));
            else if (!vehicleNumberIsValid(value)) setErrors(prev => ({ ...prev, vehicleNumber: "Invalid vehicle number format. Example: MH12AB1234." }));
            else setErrors(prev => ({ ...prev, vehicleNumber: "" }));
        }

        if (name === "vehicleRcNumber") {
            if (!isRequired(value)) setErrors(prev => ({ ...prev, vehicleRcNumber: "RC number is required." }));
            else if (!rcNumberIsValid(value)) setErrors(prev => ({ ...prev, vehicleRcNumber: "Invalid RC format (6-12 alphanumeric characters)." }));
            else setErrors(prev => ({ ...prev, vehicleRcNumber: "" }));
        }

        if (name === "modelId" || name === "fuelTypeId" || name === "vehicleTypeId") {
            setErrors(prev => ({ ...prev, [name]: isRequired(value) ? "" : "This field is required." }));
        }

        if (name === "description") {
            setErrors(prev => ({ ...prev, description: isRequired(value) ? "" : "Description is required." }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        // Validate image types and sizes
        const invalid = [];
        const accepted = [];
        files.forEach(f => {
            if (!fileIsImageType(f)) invalid.push(`${f.name}: invalid file type`);
            else if (!fileSizeUnder(f, MAX_IMAGE_SIZE)) invalid.push(`${f.name}: file too large (max 5MB)`);
            else accepted.push(f);
        });

        if (invalid.length > 0) {
            setErrors(prev => ({ ...prev, images: invalid.join("; ") }));
        } else {
            setErrors(prev => ({ ...prev, images: "" }));
        }

        setImages(accepted);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Run final validations
        const required = ["vehicleTypeId", "brandId", "modelId", "fuelTypeId", "vehicleNumber", "vehicleRcNumber", "description"];
        let hasErr = false;
        required.forEach((f) => {
            if (!isRequired(formData[f])) {
                setErrors(prev => ({ ...prev, [f]: "This field is required." }));
                hasErr = true;
            }
        });

        if (errors.vehicleNumber || errors.vehicleRcNumber || errors.images) hasErr = true;

        if (hasErr) {
            setError("Please fix validation errors before submitting the form.");
            return;
        }

        setLoading(true);
        try {
            // Step 1: Add vehicle (uses ownerApi)
            // Backend returns { message, vehicleId }
            const response = await addVehicle(userId, formData);
            const vehicleId = response.vehicleId;

            // Step 2: Upload images (uses ownerApi)
            if (images.length > 0) {
                const formDataImg = new FormData();
                images.forEach((file) => {
                    formDataImg.append("Images", file);
                });
                formDataImg.append("PrimaryImageIndex", primaryImageIndex);

                await uploadMultipleVehicleImages(vehicleId, formDataImg);
            }

            setSuccess("Vehicle added successfully!");
            setTimeout(() => {
                navigate("/owner/vehicles");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add vehicle");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-4">
            <div className="card shadow">
                <div className="card-header">
                    <h3 className="mb-0">Add New Vehicle</h3>
                </div>
                <div className="card-body p-3 p-md-4">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <h5 className="mb-3">Vehicle Details</h5>

                        <div className="row g-3">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Vehicle Type *</label>
                                <select
                                    className="form-select"
                                    name="vehicleTypeId"
                                    value={formData.vehicleTypeId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Vehicle Type</option>
                                    {vehicleTypes.map((vt) => (
                                        <option key={vt.vehicleTypeId} value={vt.vehicleTypeId}>
                                            {vt.vehicleTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Brand *</label>
                                <select
                                    className="form-select"
                                    onChange={handleBrandChange}
                                    required
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.brandId} value={brand.brandId}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && <small className="text-danger">{errors.brandId}</small>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Model *</label>
                                <select
                                    className="form-select"
                                    name="modelId"
                                    value={formData.modelId}
                                    onChange={handleChange}
                                    required
                                    disabled={models.length === 0}
                                >
                                    <option value="">Select Model</option>
                                    {models.map((model) => (
                                        <option key={model.modelId} value={model.modelId}>
                                            {model.modelName}
                                        </option>
                                    ))}
                                </select>
                                {errors.modelId && <small className="text-danger">{errors.modelId}</small>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fuel Type *</label>
                                <select
                                    className="form-select"
                                    name="fuelTypeId"
                                    value={formData.fuelTypeId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Fuel Type</option>
                                    {fuelTypes.map((ft) => (
                                        <option key={ft.fuelTypeId} value={ft.fuelTypeId}>
                                            {ft.fuelTypeName}
                                        </option>
                                    ))}
                                </select>
                                {errors.fuelTypeId && <small className="text-danger">{errors.fuelTypeId}</small>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Vehicle Number *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="vehicleNumber"
                                    placeholder="MH12AB1234"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.vehicleNumber && <small className="text-danger">{errors.vehicleNumber}</small>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">RC Number *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="vehicleRcNumber"
                                    placeholder="RC123456"
                                    value={formData.vehicleRcNumber}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.vehicleRcNumber && <small className="text-danger">{errors.vehicleRcNumber}</small>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Air Conditioning</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="ac"
                                        value="1"
                                        checked={formData.ac === 1}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ac: parseInt(e.target.value) })
                                        }
                                    />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="ac"
                                        value="0"
                                        checked={formData.ac === 0}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ac: parseInt(e.target.value) })
                                        }
                                    />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                name="description"
                                placeholder="Enter vehicle description"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                            {errors.description && <small className="text-danger">{errors.description}</small>}
                        </div>

                        <hr />

                        <h5 className="mb-3">Upload Images</h5>

                        <div className="mb-3">
                            <label className="form-label">Vehicle Images (Max 5MB each)</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/jpeg,image/jpg,image/png"
                                multiple
                                onChange={handleImageChange}
                            />
                            {errors.images && <small className="text-danger">{errors.images}</small>}
                            <small className="text-muted">
                                You can upload multiple images. First image will be primary by default.
                            </small>
                        </div>

                        {images.length > 0 && (
                            <div className="mb-3">
                                <label className="form-label">Select Primary Image</label>
                                <div className="row g-3">
                                    {images.map((img, index) => (
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
                                                            name="primaryImage"
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

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/owner/vehicles")}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading || Object.values(errors).some(e => e) || !formData.vehicleTypeId || !formData.brandId || !formData.modelId || !formData.fuelTypeId}>
                                {loading ? "Adding Vehicle..." : (Object.values(errors).some(e => e) ? "Fix validation errors" : "Add Vehicle")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddVehicle;
