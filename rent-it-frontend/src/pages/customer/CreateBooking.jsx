import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingService from "../../services/BookingService";
import api from "../../api/axios";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { datesBetween } from "../../utils/validators";

// Helper to format date as yyyy-mm-dd (DateOnly compatible) for API
// Helper to format date as yyyy-mm-dd (DateOnly compatible) for API using Local Time
const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to check if vehicle is available based on status from backend
const isVehicleActive = (vehicle) => {
    if (!vehicle) return false;
    // Backend returns 'availabilityStatus' with value 'ACTIVE'
    // Also checking legacy fields just in case, but 'ACTIVE' is the key
    const status = vehicle.availabilityStatus || vehicle.status || vehicle.vehicleStatus;
    return status && status.toUpperCase() === "ACTIVE";
};

function CreateBooking() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const { userId } = useSelector((state) => state.auth);

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pickupTime, setPickupTime] = useState("09:00");
    const [returnTime, setReturnTime] = useState("09:00");
    const [bookedDates, setBookedDates] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Fetch vehicle details and booked dates
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            console.log('🚀 [CreateBooking] Starting fetch for vehicle ID:', vehicleId);
            try {
                setLoading(true);
                setError("");

                const [vehicleRes, bookedRes] = await Promise.all([
                    api.get(`/customer/vehicles/${vehicleId}`),
                    api.get(`/customer/bookings/vehicle/${vehicleId}/booked-dates`)
                ]);

                if (isMounted) {
                    console.log('✅ [CreateBooking] Data received:', { vehicle: vehicleRes.data, dates: bookedRes.data });
                    setVehicle(vehicleRes.data);
                    // Convert backend LocalDate (YYYY-MM-DD) into a local Date object
                    const parseLocalDate = (iso) => {
                        if (!iso) return null;
                        const parts = iso.split("-").map(Number);
                        // new Date(year, monthIndex, day) constructs a date in local timezone
                        return new Date(parts[0], parts[1] - 1, parts[2]);
                    };
                    setBookedDates(bookedRes.data.map(dStr => parseLocalDate(dStr)));
                }
            } catch (err) {
                console.error('❌ [CreateBooking] Error:', err);
                if (isMounted) {
                    const msg = err.response?.data?.message || err.response?.data || err.message;
                    setError(typeof msg === 'string' ? msg : "Failed to load vehicle details. Server might be down.");
                }
            } finally {
                if (isMounted) {
                    console.log('🏁 [CreateBooking] Loading finished');
                    setLoading(false);
                }
            }
        }
        fetchData();
        return () => { isMounted = false; };
    }, [vehicleId]);

    // Calculate total price when dates change
    useEffect(() => {
        if (vehicle && startDate && endDate) {
            const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const serviceDays = Math.max(1, daysDiff + 1); // Inclusive days
            setTotalPrice(serviceDays * (vehicle.pricePerDay || 0));
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, vehicle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!startDate || !endDate) {
            setError("Please select both pickup and return dates.");
            return;
        }

        if (startDate > endDate) {
            setError("Pickup date must be before return date.");
            return;
        }

        // Client-side overlap check using bookedDates
        const selectedDates = datesBetween(startDate, endDate).map(d => d.toDateString());
        const overlap = bookedDates.some(bd => selectedDates.includes(bd.toDateString()));
        if (overlap) {
            setError("Selected dates overlap with existing bookings. Please choose different dates.");
            return;
        }

        if (!userId) {
            setError("You must be logged in to create a booking.");
            return;
        }

        // Prevent booking if vehicle is not available (client-side defensive check)
        if (!isVehicleActive(vehicle)) {
            setError("This vehicle is currently not available for booking.");
            return;
        }

        try {
            // First check availability (prevents race conditions and gives friendly feedback)
            const startStr = formatDate(startDate);
            const endStr = formatDate(endDate);
            const pickupTimeStr = pickupTime + ":00";
            const returnTimeStr = returnTime + ":00";
            const availability = await BookingService.checkAvailability(vehicleId, startStr, endStr, pickupTimeStr, returnTimeStr);

            if (!availability || availability.available === false) {
                setError("Selected dates/times are no longer available. Please choose different dates or times.");
                return;
            }

            const bookingDto = {
                userId: parseInt(userId),
                vehicleId: parseInt(vehicleId),
                startingDate: startStr,
                endDate: endStr,
                pickupTime: pickupTimeStr,
                returnTime: returnTimeStr
            };

            await BookingService.createBooking(bookingDto);
            alert("Booking created successfully!");
            navigate("/customer/bookings");
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to create booking.";
            setError(typeof msg === 'string' ? msg : "Failed to create booking.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">🚀 Loading Vehicle & Availability...</p>
            </div>
        );
    }

    if (error && !vehicle) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger shadow">
                    <h4 className="alert-heading">Connection Error</h4>
                    <p>{error}</p>
                    <hr />
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
                    <button className="btn btn-outline-secondary ms-2" onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }

    if (!vehicle) return <div className="container mt-5"><div className="alert alert-warning">Vehicle not found.</div></div>;

    // Get the primary image or first image if available
    const mainImage = vehicle.vehicleImages && vehicle.vehicleImages.length > 0
        ? `data:image/jpeg;base64,${vehicle.vehicleImages[0].imageData}`
        : "https://placehold.co/600x400?text=No+Image";

    const today = new Date();

    return (
        <div className="pb-4">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-dark text-white p-3">
                    <h3 className="mb-0">Confirm Your Booking</h3>
                    <p className="mb-0 text-light opacity-75">{vehicle.brand} {vehicle.model} - {vehicle.registrationNumber}</p>
                </div>
                <div className="card-body p-3 p-md-4">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="row g-3 g-md-4">
                        <div className="col-12 col-lg-5">
                            <img
                                src={mainImage}
                                alt={vehicle.model}
                                className="img-fluid rounded shadow-sm mb-4"
                                style={{ width: "100%", height: "300px", objectFit: "cover" }}
                            />

                            <div className="bg-light p-3 rounded mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Vehicle Highlights</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Fuel Type:</span>
                                    <span className="fw-bold">{vehicle.fuelType}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>AC Available:</span>
                                    <span className="fw-bold">{vehicle.hasAC ? "Yes" : "No"}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Rent Rate:</span>
                                    <span className="fw-bold text-success">₹{vehicle.pricePerDay} / day</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-7">
                            <form onSubmit={handleSubmit} className="ps-lg-3">
                                <div className="bg-info bg-opacity-10 p-3 rounded mb-4 border border-info border-opacity-25">
                                    <label className="fw-bold text-info-emphasis d-block mb-1">
                                        <i className="bi bi-geo-alt-fill me-2"></i>Pickup Location (Owner Address)
                                    </label>
                                    <p className="mb-1 fw-medium">
                                        {vehicle.owner?.address?.addressLine && `${vehicle.owner.address.addressLine}, `}
                                        {vehicle.owner?.address?.area}, {vehicle.owner?.address?.city} - {vehicle.owner?.address?.pincode}
                                    </p>
                                    <small className="text-muted">
                                        Owner: <strong>{vehicle.owner?.ownerName}</strong> | {vehicle.owner?.ownerPhoneNumber}
                                    </small>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                        <label className="form-label fw-bold">Pickup Date & Time</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => {
                                                setStartDate(date);
                                                // Real-time validation
                                                if (endDate && date > endDate) {
                                                    setError("Pickup date cannot be after return date.");
                                                    setEndDate(null); // Reset invalid end date
                                                    return;
                                                }

                                                // If single date overlaps an existing booked date
                                                if (bookedDates.some(bd => bd.toDateString() === date.toDateString())) {
                                                    setError("Selected pickup date overlaps with existing bookings. Pick another date.");
                                                } else if (endDate) {
                                                    // If range overlaps any booked date
                                                    const selected = datesBetween(date, endDate).map(d => d.toDateString());
                                                    const overlap = bookedDates.some(bd => selected.includes(bd.toDateString()));
                                                    if (overlap) setError("Selected date range overlaps existing bookings.");
                                                    else setError("");
                                                } else {
                                                    setError("");
                                                }
                                            }}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={today}
                                            excludeDates={bookedDates}
                                            className="form-control"
                                            placeholderText="Select start date"
                                            dateFormat="yyyy-MM-dd"
                                            required
                                        />
                                        <input
                                            type="time"
                                            className="form-control mt-2"
                                            value={pickupTime}
                                            onChange={(e) => setPickupTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-bold">Return Date & Time</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => {
                                                setEndDate(date);
                                                if (startDate && date < startDate) {
                                                    setError("Return date cannot be before pickup date.");
                                                    return;
                                                }

                                                // If single date overlaps existing booked date
                                                if (bookedDates.some(bd => bd.toDateString() === date.toDateString())) {
                                                    setError("Selected return date overlaps with existing bookings. Pick another date.");
                                                    return;
                                                }

                                                // If range overlaps any booked date
                                                if (startDate) {
                                                    const selected = datesBetween(startDate, date).map(d => d.toDateString());
                                                    const overlap = bookedDates.some(bd => selected.includes(bd.toDateString()));
                                                    if (overlap) setError("Selected date range overlaps existing bookings.");
                                                    else setError("");
                                                } else {
                                                    setError("");
                                                }
                                            }}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate || today}
                                            excludeDates={bookedDates}
                                            className="form-control"
                                            placeholderText="Select end date"
                                            dateFormat="yyyy-MM-dd"
                                            required
                                        />
                                        <input
                                            type="time"
                                            className="form-control mt-2"
                                            value={returnTime}
                                            onChange={(e) => setReturnTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="card bg-light border-0 mb-4">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Rental Days:</span>
                                            <span className="fw-medium">{totalPrice > 0 ? (totalPrice / vehicle.pricePerDay) : 0} Days</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Rent Amount:</span>
                                            <span className="fw-bold">₹{totalPrice}</span>
                                        </div>
                                        <div className="d-flex justify-content-between text-danger mb-2">
                                            <span>Security Deposit (Pay Now):</span>
                                            <span className="fw-bold">₹{vehicle.deposit || 0}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0 fw-bold">Total Payable Now:</h5>
                                            <h4 className="text-success mb-0 fw-bold">₹{vehicle.deposit || 0}</h4>
                                        </div>
                                        <div className="text-end mt-2">
                                            <small className="text-muted italic">
                                                *Rent of <strong>₹{totalPrice}</strong> will be deducted from deposit upon return.
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg shadow-sm"
                                        disabled={!startDate || !endDate || !!error || !isVehicleActive(vehicle)}
                                    >
                                        <i className="bi bi-shield-lock-fill me-2"></i>
                                        {!isVehicleActive(vehicle) ? "Vehicle not available" : "Pay Deposit & Confirm Booking"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-link text-secondary"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel & Go Back
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

export default CreateBooking;
