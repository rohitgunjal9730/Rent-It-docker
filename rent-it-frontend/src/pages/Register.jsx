import React, { useEffect, useState } from "react";
import { getCities, getAreasByCity } from "../services/LocationService";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Validation helpers
import { isRequired, isEmail, isStrongPassword, aadharIsValid, panIsValid, phoneIsValid } from "../utils/validators";


function Register() {

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [questions, setQuestions] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({}); // <-- Validation errors

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roleId: "",
    fname: "",
    mname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    drivingLicenceNo: "",
    adharNo: "",
    panNo: "",
    address: "",
    questionId: "",
    answer: "",
    cityId: "",
    areaId: ""
  });

  useEffect(() => {
    getCities().then(setCities);

    api.get("/auth/security-questions")
      .then(res => {
        setQuestions(res.data);
      })
      .catch(err => {
        console.error("Error fetching security questions", err);
      });

  }, []);


  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "roleId":
        if (!isRequired(value)) msg = "Please select a role (Customer or Owner).";
        break;

      case "fname":
        if (!isRequired(value)) msg = "First name is required.";
        else if (!/^[A-Z][a-z]{2,50}$/.test(value)) msg = "First name should start with a capital letter and be 3-50 letters.";
        break;

      case "mname":
        if (value && !/^[A-Z][a-z]{2,50}$/.test(value)) msg = "Middle name should start with a capital letter and be 3-50 letters.";
        break;

      case "lname":
        if (!isRequired(value)) msg = "Last name is required.";
        else if (!/^[A-Z][a-z]{2,50}$/.test(value)) msg = "Last name should start with a capital letter and be 3-50 letters.";
        break;

      case "phone":
        if (!isRequired(value)) msg = "Phone number is required.";
        else if (!phoneIsValid(value)) msg = "Phone must be a 10-digit Indian mobile number starting with 7/8/9.";
        break;

      case "email":
        if (!isRequired(value)) msg = "Email is required.";
        else if (!isEmail(value)) msg = "Please enter a valid email address (example: name@example.com).";
        break;

      case "password":
        if (!isRequired(value)) msg = "Password is required.";
        else if (!isStrongPassword(value)) msg = "Password must be at least 8 characters and include uppercase, lowercase, a number and a special character (e.g., A@1aabcd).";
        break;

      case "confirmPassword":
        if (!isRequired(value)) msg = "Please confirm your password.";
        else if (formData.password && value !== formData.password) msg = "Passwords do not match. Make sure both entries are identical.";
        break;

      case "adharNo":
        if (!isRequired(value)) msg = "Aadhar number is required.";
        else if (!aadharIsValid(value)) msg = "Aadhar must be exactly 12 digits.";
        break;

      case "panNo":
        if (value && !panIsValid(value)) msg = "PAN format invalid. Expected format: ABCDE1234F.";
        break;

      case "drivingLicenceNo":
        if (!isRequired(value)) msg = "Driving licence number is required.";
        else if (value && value.length < 6) msg = "Driving licence looks too short. Check the number and try again.";
        break;

      case "address":
        if (!isRequired(value)) msg = "Address is required and should be at least 5 characters.";
        else if (value.length < 5) msg = "Address should be at least 5 characters.";
        break;

      case "questionId":
        if (!isRequired(value)) msg = "Please select a security question.";
        break;

      case "answer":
        if (!isRequired(value)) msg = "Security answer is required.";
        break;

      case "cityId":
        if (!isRequired(value)) msg = "Please select a city.";
        break;

      case "areaId":
        if (!isRequired(value)) msg = "Please select an area.";
        break;

    }

    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value); // live validate
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setFormData({ ...formData, cityId, areaId: "" });
    setAreas([]);
    setErrors(prev => ({ ...prev, cityId: "", areaId: "" }));

    if (cityId) {
      getAreasByCity(cityId).then(setAreas);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields before submit (in case user hasn't touched some)
    const required = [
      "roleId", "fname", "lname", "phone", "email", "password", "confirmPassword",
      "drivingLicenceNo", "adharNo", "address", "questionId", "answer", "cityId", "areaId"
    ];

    required.forEach(f => validateField(f, formData[f]));

    // If any validation error exists, block submit
    const hasErrors = Object.values(errors).some(msg => msg);
    const allFilled = required.every(f => isRequired(formData[f]));
    if (hasErrors || !allFilled) {
      setErrors(prev => ({ ...prev, form: "Please fix the highlighted errors before submitting." }));
      return;
    }

    const { confirmPassword, ...rest } = formData;
    const payload = {
      ...rest,
      questionId: Number(formData.questionId)
    };

    try {
      await api.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  // Compute form validity for disabling submit button
  const requiredFields = [
    "roleId", "fname", "lname", "phone", "email", "password", "confirmPassword",
    "drivingLicenceNo", "adharNo", "address", "questionId", "answer", "cityId", "areaId"
  ];
  const allFilled = requiredFields.every(f => isRequired(formData[f]));
  const noErrors = Object.values(errors).every((v) => !v);
  const isFormValid = allFilled && noErrors;


  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6">
        <div className="card shadow p-3 p-md-4">
          <h3 className="text-center mb-3 mb-md-4">Registration Form</h3>

          <form onSubmit={handleSubmit}>
            <h5 className="mb-3">Personal Info</h5>

            <div className="mb-3">
              <label className="form-label">Select Role *</label>
              <select
                className="form-select"
                name="roleId"
                onChange={handleChange}

              >
                <option value="">Select Role</option>
                <option value="2">Customer</option>
                <option value="3">Owner</option>
              </select>
              {errors.roleId && <small className="text-danger">{errors.roleId}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">First Name *</label>
              <input
                className="form-control"
                name="fname"
                placeholder="First name (Start with capital)"
                onChange={handleChange}
              />
              {errors.fname && <small className="text-danger">{errors.fname}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Middle Name</label>
              <input
                className="form-control"
                name="mname"
                placeholder="Middle name (Start with capital)"
                onChange={handleChange}
              />
              {errors.mname && <small className="text-danger">{errors.mname}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name *</label>
              <input
                className="form-control"
                name="lname"
                placeholder="Last name (Start with capital)"
                onChange={handleChange}
              />
              {errors.lname && <small className="text-danger">{errors.lname}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone No *</label>
              <input
                className="form-control"
                name="phone"
                placeholder="10-digit mobile number Ex:9784565236"
                onChange={handleChange}
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="example@email.com"
                onChange={handleChange}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password *</label>

              <div className="input-group">
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min 8 chars, A-Z, a-z, 0-9, symbol"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>



            <div className="mb-3">
              <label className="form-label">Confirm Password *</label>

              <div className="input-group">
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword}</small>
              )}
            </div>


            <div className="mb-3">
              <label className="form-label">Driving Licence No *</label>
              <input
                className="form-control"
                name="drivingLicenceNo"
                placeholder="DL Format: MH1220191234567"
                onChange={handleChange}
              />
              {errors.drivingLicenceNo && <small className="text-danger">{errors.drivingLicenceNo}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Aadhar No *</label>
              <input
                className="form-control"
                name="adharNo"
                placeholder="12-digit Aadhaar number"
                onChange={handleChange}
              />
              {errors.adharNo && <small className="text-danger">{errors.adharNo}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">PAN No</label>
              <input
                className="form-control"
                name="panNo"
                placeholder="PAN Format: ABCDE1234F"
                onChange={handleChange}
              />
              {errors.panNo && <small className="text-danger">{errors.panNo}</small>}
            </div>

            <hr />

            <h5 className="mb-3">Address Info</h5>

            <div className="mb-3">
              <label className="form-label">City *</label>
              <select className="form-select" value={formData.cityId} onChange={handleCityChange}>
                <option value="">Select City</option>
                {cities.map(c => (
                  <option key={c.cityId} value={c.cityId}>{c.cityName}</option>
                ))}
              </select>
              {errors.cityId && <small className="text-danger">{errors.cityId}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Area *</label>
              <select
                className="form-select"
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                disabled={!formData.cityId}
              >
                <option value="">Select Area</option>
                {areas.map(a => (
                  <option key={a.areaId} value={a.areaId}>{a.areaName}</option>
                ))}
              </select>
              {errors.areaId && <small className="text-danger">{errors.areaId}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Address *</label>
              <textarea
                className="form-control"
                rows="3"
                name="address"
                placeholder="House no, Street, Landmark"
                onChange={handleChange}
              ></textarea>
              {errors.address && <small className="text-danger">{errors.address}</small>}
            </div>

            <hr />

            <h5 className="mb-3">Security Question</h5>

            <div className="mb-3">
              <label className="form-label">Question *</label>
              <select
                className="form-select"
                name="questionId"
                onChange={handleChange}
              >
                <option value="">Select Question</option>

                {questions.map(q => (
                  <option key={q.questionId} value={q.questionId}>
                    {q.question}
                  </option>
                ))}
              </select>

              {errors.questionId && <small className="text-danger">{errors.questionId}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Answer *</label>
              <input
                className="form-control"
                name="answer"
                placeholder="Answer (Eg: Pune)"
                onChange={handleChange}
              />


              {errors.answer && <small className="text-danger">{errors.answer}</small>}
            </div>

            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
            <button className="btn btn-primary w-100" disabled={!isFormValid} aria-disabled={!isFormValid}>
              {isFormValid ? "Register" : "Complete required fields"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;




