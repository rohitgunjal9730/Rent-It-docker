import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCustomerProfile, updateCustomerProfile } from "../../services/CustomerService";
import { getCities, getAreasByCity } from "../../services/LocationService";
import api from "../../api/axios";

function CustomerProfile() {
  const { userId } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  // editable fields
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Validation errors
  const [phoneError, setPhoneError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    async function load() {
      if (!userId) return; // Guard clause: Don't fetch if no user ID

      try {
        setLoading(true);
        setError("");

        const [profileData, citiesData] = await Promise.all([
          getCustomerProfile(userId),
          getCities(),
        ]);

        setProfile(profileData);
        setPhone(profileData.phone || "");
        setAddress(profileData.address || "");

        setCities(citiesData || []);

        // set initial city/area selections
        if (profileData.cityId) {
          setSelectedCity(profileData.cityId);
          const areasForCity = await getAreasByCity(profileData.cityId);
          setAreas(areasForCity);
          setSelectedArea(profileData.areaId);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  const handleCityChange = async (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedCity(value);
    setSelectedArea(null); // Reset area when city changes
    setAreas([]);
    setError("");

    if (value) {
      try {
        const res = await getAreasByCity(value);
        setAreas(res);
      } catch (err) {
        console.error("Error fetching areas:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User session is invalid. Please log in again.");
      return;
    }
    setSaving(true);
    setSuccess("");
    setError("");

    // Clear previous validation errors
    setPhoneError("");
    setAreaError("");
    setAddressError("");

    // Client-side validation
    if (phone && !/^\d{10,15}$/.test(phone)) {
      setPhoneError("Phone must be 10 to 15 digits.");
      setSaving(false);
      return;
    }

    // Only validate area if a city is selected
    if (selectedCity && !selectedArea) {
      setAreaError("Please select an area for the chosen city.");
      setSaving(false);
      return;
    }

    if (!address || address.trim().length < 5) {
      setAddressError("Please enter a valid address (at least 5 characters).");
      setSaving(false);
      return;
    }

    const payload = {
      phone: phone,
      address: address,
      areaId: selectedArea,
    };

    try {
      console.log("🚀 Saving profile...", { userId, payload });
      const updated = await updateCustomerProfile(userId, payload);
      console.log("✅ Profile saved:", updated);
      setProfile(updated);
      setPhoneError("");
      setAreaError("");
      setAddressError("");
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      // Handle potentially complex error objects from Spring Boot
      let msg = "Failed to update profile.";
      if (err.response) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data?.message) {
          msg = err.response.data.message;
        } else {
          msg = `Server Error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (value && !/^\d{10,15}$/.test(value)) {
      setPhoneError("Phone must be 10 to 15 digits.");
    } else {
      setPhoneError("");
    }
    setError("");
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value && value.trim().length < 5) {
      setAddressError("Address must be at least 5 characters.");
    } else {
      setAddressError("");
    }
    setError("");
  };

  // Check for changes
  const hasChanges = profile && (
    phone !== (profile.phone || "") ||
    address !== (profile.address || "") ||
    selectedArea !== (profile.areaId || null) ||
    selectedCity !== (profile.cityId || null)
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4">
        <h1 className="mb-0">My Profile</h1>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 g-md-4">
        {/* Personal Info card */}
        <div className="col-12 col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <strong>Personal Information</strong>
              <div className="small text-muted">You can edit your phone number. Other fields are read-only.</div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" style={{ backgroundColor: "#e9ecef" }} value={`${profile.fname || ""} ${profile.mname || ""} ${profile.lname || ""}`} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" style={{ backgroundColor: "#e9ecef" }} value={profile.email || ""} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input type="tel" className={`form-control ${phoneError ? 'is-invalid' : ''}`} style={{ backgroundColor: "#ffffff" }} value={phone} onChange={handlePhoneChange} />
                {phoneError && <div className="invalid-feedback">{phoneError}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Driving Licence</label>
                <input className="form-control" style={{ backgroundColor: "#e9ecef" }} value={profile.drivingLicenceNo || ""} readOnly />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">PAN</label>
                  <input className="form-control" style={{ backgroundColor: "#e9ecef" }} value={profile.panNo || ""} readOnly />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Aadhaar</label>
                  <input className="form-control" style={{ backgroundColor: "#e9ecef" }} value={profile.adharNo || ""} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Info card */}
        <div className="col-12 col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <strong>Address Information</strong>
              <div className="small text-muted">Select city and area, and edit your address.</div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">City</label>
                <select className={`form-select`} style={{ backgroundColor: "#ffffff" }} value={selectedCity || ""} onChange={handleCityChange}>
                  <option value="">-- Select city --</option>
                  {cities.map((c) => (
                    <option key={c.cityId} value={c.cityId}>{c.cityName}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Area</label>
                <select className={`form-select ${areaError ? 'is-invalid' : ''}`} style={{ backgroundColor: "#ffffff" }} value={selectedArea || ""} onChange={(e) => { setSelectedArea(e.target.value ? Number(e.target.value) : null); setAreaError(''); setError(''); }}>
                  <option value="">-- Select area --</option>
                  {areas.map((a) => (
                    <option key={a.areaId} value={a.areaId}>{a.areaName} ({a.pincode})</option>
                  ))}
                </select>
                {areaError && <div className="invalid-feedback">{areaError}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea className={`form-control ${addressError ? 'is-invalid' : ''}`} style={{ backgroundColor: "#ffffff" }} rows="3" value={address} onChange={handleAddressChange}></textarea>
                {addressError && <div className="invalid-feedback">{addressError}</div>}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  className={`btn ${hasChanges ? 'btn-primary' : 'btn-secondary'}`}
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges || saving || phoneError || addressError}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CustomerProfile;
