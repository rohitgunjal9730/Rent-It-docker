import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import OwnerProfileService from "../../api/OwnerProfileService";

function OwnerProfile() {
    const { userId } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState({
        fname: "",
        mname: "",
        lname: "",
        email: "",
        phone: "",
        drivingLicenceNo: "",
        adharNo: "",
        panNo: "",
        address: "",
        areaId: "",
        cityId: "",
        cityName: "",
        areaName: "",
        pincode: ""
    });

    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const id = userId || 2; // Fallback for dev
        fetchData(id);
    }, [userId]);

    const fetchData = async (id) => {
        try {
            setLoading(true);
            const [profileData, citiesData] = await Promise.all([
                OwnerProfileService.getProfile(id),
                OwnerProfileService.getCities()
            ]);

            setProfile(profileData);
            setCities(citiesData);

            if (profileData.cityId) {
                const areasData = await OwnerProfileService.getAreasByCity(profileData.cityId);
                setAreas(areasData);
            }
        } catch (err) {
            console.error("Error fetching profile data:", err);
            setMessage({ type: "danger", text: "Failed to load profile data. Make sure the backend is running." });
        } finally {
            setLoading(false);
        }
    };

    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        setProfile({ ...profile, cityId, areaId: "" });
        if (cityId) {
            try {
                const areasData = await OwnerProfileService.getAreasByCity(cityId);
                setAreas(areasData);
            } catch (err) {
                console.error("Error fetching areas:", err);
            }
        } else {
            setAreas([]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: "", text: "" });
        try {
            const id = userId || 2;
            const updatePayload = {
                phone: profile.phone,
                address: profile.address,
                areaId: parseInt(profile.areaId) || 0
            };

            await OwnerProfileService.updateProfile(id, updatePayload);
            setMessage({ type: "success", text: "Profile updated successfully!" });

            // Re-fetch to confirm changes
            setTimeout(() => fetchData(id), 500);
        } catch (err) {
            console.error("Error updating profile:", err);
            setMessage({ type: "danger", text: "Failed to update profile. Please try again." });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="pb-4">
            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
                    {message.type === "success" ? <i className="bi bi-check-circle-fill me-2"></i> : <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
                </div>
            )}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-primary text-white p-3 p-md-4">
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3" style={{ width: "60px", height: "60px", fontSize: "1.5rem", fontWeight: "bold" }}>
                            {profile.fname?.charAt(0)}{profile.lname?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="mb-0">{`${profile.fname || ""} ${profile.mname || ""} ${profile.lname || ""}`.trim() || "Owner Profile"}</h3>
                            <p className="mb-0 opacity-75">Manage your personal information</p>
                        </div>
                    </div>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleUpdate}>
                        <div className="row g-4">
                            {/* Read-only Personal Info */}
                            <div className="col-12">
                                <h5 className="border-bottom pb-2 mb-3 text-secondary">
                                    <i className="bi bi-person-lock me-2"></i>Personal Information (Read-only)
                                </h5>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label text-muted small text-uppercase fw-bold">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={`${profile.fname || ""} ${profile.mname || ""} ${profile.lname || ""}`.trim()}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small text-uppercase fw-bold">Email Address</label>
                                <input type="email" className="form-control bg-light" value={profile.email || ""} readOnly />
                            </div>

                            <div className="col-12 mt-5">
                                <h5 className="border-bottom pb-2 mb-3 text-secondary">
                                    <i className="bi bi-shield-check me-2"></i>Documents (Read-only)
                                </h5>
                            </div>

                            <div className="col-12 col-md-4">
                                <label className="form-label text-muted small text-uppercase fw-bold">Driving Licence No</label>
                                <input type="text" className="form-control bg-light" value={profile.drivingLicenceNo || ""} readOnly />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label text-muted small text-uppercase fw-bold">Adhar Number</label>
                                <input type="text" className="form-control bg-light" value={profile.adharNo || ""} readOnly />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label text-muted small text-uppercase fw-bold">PAN Number</label>
                                <input type="text" className="form-control bg-light" value={profile.panNo || ""} readOnly />
                            </div>

                            <div className="col-12 mt-5">
                                <h5 className="border-bottom pb-2 mb-3 text-primary">
                                    <i className="bi bi-pencil-square me-2"></i>Changeable Information
                                </h5>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Phone Number</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-primary"
                                        value={profile.phone || ""}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">Full Address</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                                    <textarea
                                        className="form-control border-primary"
                                        rows="2"
                                        value={profile.address || ""}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">City</label>
                                <select
                                    className="form-select border-primary"
                                    value={profile.cityId || ""}
                                    onChange={handleCityChange}
                                    required
                                >
                                    <option value="">Select City</option>
                                    {cities.map(c => (
                                        <option key={c.cityId} value={c.cityId}>{c.cityName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold">Area / Locality</label>
                                <select
                                    className="form-select border-primary"
                                    value={profile.areaId || ""}
                                    onChange={(e) => setProfile({ ...profile, areaId: e.target.value })}
                                    required
                                    disabled={!profile.cityId}
                                >
                                    <option value="">Select Area</option>
                                    {areas.map(a => (
                                        <option key={a.areaId} value={a.areaId}>{a.areaName} ({a.pincode})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 mt-4 text-end">
                                <button type="submit" className="btn btn-primary btn-lg px-5 shadow-sm" disabled={updating}>
                                    {updating ? (
                                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                                    ) : (
                                        <><i className="bi bi-check2-circle me-2"></i>Update Profile</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OwnerProfile;
