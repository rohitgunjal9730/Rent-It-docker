import { useEffect, useState } from "react";
import BookingService from "../../services/BookingService";
import PaymentService from "../../services/PaymentService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { userId } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userId) return; // Don't fetch if no user

        async function fetchBookings() {
            try {
                setLoading(true);
                const data = await BookingService.getBookingsByUser(userId);
                console.log("✅ My Bookings fetched:", data);
                setBookings(data);
            } catch (err) {
                console.error("❌ Error fetching bookings:", err);
                setError("Failed to fetch your bookings.");
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, [userId]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Fetching your booking history...</p>
            </div>
        );
    }

    async function handlePayment(booking, type) {
        let amountToPay = 0;
        if (type === 'DEPOSIT') {
            amountToPay = booking.depositAmount - (booking.paidAmount || 0);
            if (amountToPay <= 0) amountToPay = booking.depositAmount; // Fallback
        } else if (type === 'REMAINING') {
            amountToPay = booking.totalAmount - (booking.paidAmount || 0);
        }

        const method = window.prompt(`Proceed to pay ₹${amountToPay}? Enter Payment Method (CARD, UPI, NETBANKING):`, "CARD");
        if (!method) return;

        try {
            await PaymentService.processPayment(booking.bookingId, amountToPay, method);
            alert("Payment Successful!");
            // Refresh bookings
            const data = await BookingService.getBookingsByUser(userId);
            setBookings(data);
        } catch (err) {
            console.error("Payment failed", err);
            alert("Payment Failed: " + (err.response?.data?.message || err.message));
        }
    }

    return (
        <div className="pb-4">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
                <h2 className="mb-0">My Bookings</h2>
                <button className="btn btn-primary btn-sm" onClick={() => navigate("/customer/vehicles")}>
                    <i className="bi bi-plus-lg me-1"></i>New Booking
                </button>
            </div>

            {error && <div className="alert alert-danger shadow-sm">{error}</div>}

            {bookings.length === 0 ? (
                <div className="card text-center p-5 border-0 shadow-sm">
                    <div className="card-body">
                        <i className="bi bi-calendar-x text-muted" style={{ fontSize: "3rem" }}></i>
                        <h4 className="mt-3">No Bookings Found</h4>
                        <p className="text-muted">You haven't booked any vehicles yet.</p>
                        <button className="btn btn-primary" onClick={() => navigate("/customer/vehicles")}>
                            Browse Vehicles
                        </button>
                    </div>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover align-middle bg-white mb-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th className="ps-3">Booking info</th>
                                <th>Vehicle</th>
                                <th>Pickup Details</th>
                                <th>Return Details</th>
                                <th>Pricing Summary</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td className="ps-3">
                                        <div className="fw-bold text-dark">#{booking.bookingId}</div>
                                        <div className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>
                                            {new Date(booking.bookingDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        {booking.vehicle ? (
                                            <div
                                                className="d-flex flex-column"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => navigate(`/customer/vehicles/${booking.vehicle.vehicleId}`)}
                                            >
                                                <span className="fw-bold text-primary hover-link">
                                                    {booking.vehicle.model?.brand?.brand} {booking.vehicle.model?.model}
                                                </span>
                                                <small className="text-muted">
                                                    Reg: {booking.vehicle.vehicleNumber}
                                                </small>
                                                <small className="text-info" style={{ fontSize: '0.7rem' }}>
                                                    Click to view details
                                                </small>
                                            </div>
                                        ) : "N/A"}
                                    </td>
                                    <td>
                                        <div className="fw-medium text-dark">{booking.startingDate}</div>
                                        <div className="badge bg-light text-dark border"><i className="bi bi-clock me-1"></i>{booking.pickupTime}</div>
                                    </td>
                                    <td>
                                        <div className="fw-medium text-dark">{booking.endDate}</div>
                                        <div className="badge bg-light text-dark border"><i className="bi bi-clock me-1"></i>{booking.returnTime}</div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted small">Daily Rate:</span>
                                            <span className="fw-bold small">₹{booking.vehicle?.vehicleType?.rate || '0'}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted small">Total Rent:</span>
                                            <span className="fw-bold small">₹{booking.totalAmount}</span>
                                        </div>
                                        <div className="d-flex justify-content-between text-danger">
                                            <span className="small">Security Deposit:</span>
                                            <span className="fw-bold small">₹{booking.depositAmount}</span>
                                        </div>
                                        {booking.paidAmount > booking.totalAmount &&
                                            booking.bookingStatus !== 'COMPLETED' &&
                                            booking.bookingStatus !== 'CANCELLED' &&
                                            booking.bookingStatus !== 'CANCEL_REQUESTED' && (
                                                <div className="d-flex justify-content-between text-success mt-1 border-top pt-1">
                                                    <span className="small fw-bold">Refundable:</span>
                                                    <span className="fw-bold small">₹{booking.paidAmount - booking.totalAmount} (on return)</span>
                                                </div>
                                            )}
                                        {booking.bookingStatus === 'COMPLETED' && (
                                            <div className="mt-1 border-top pt-1">
                                                {booking.paidAmount > booking.totalAmount ? (
                                                    <div className="d-flex justify-content-between text-success">
                                                        <span className="small fw-bold">Refunded:</span>
                                                        <span className="fw-bold small">₹{booking.paidAmount - booking.totalAmount}</span>
                                                    </div>
                                                ) : booking.paidAmount === booking.totalAmount ? (
                                                    <div className="text-center text-muted small fst-italic">
                                                        All payments settled
                                                    </div>
                                                ) : null}
                                            </div>

                                        )}
                                        {booking.bookingStatus === 'CANCEL_REQUESTED' && (
                                            <div className="mt-1 border-top pt-1 text-warning small" style={{ fontSize: '0.75rem' }}>
                                                <i className="bi bi-hourglass-split me-1"></i>
                                                Waiting for owner refund: <strong>₹{booking.paidAmount || 0}</strong>
                                            </div>
                                        )}
                                        {booking.bookingStatus === 'CANCELLED' && booking.paymentStatus === 'REFUNDED' && (
                                            <div className="mt-1 border-top pt-1">
                                                <div className="d-flex justify-content-between text-success">
                                                    <span className="small fw-bold">Refunded:</span>
                                                    <span className="fw-bold small">₹{booking.paidAmount || 0}</span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <div className="mb-2">
                                            <span className={`badge rounded-pill ${booking.bookingStatus === 'CONFIRMED' ? 'bg-success' :
                                                booking.bookingStatus === 'CANCEL_REQUESTED' ? 'bg-warning text-dark' :
                                                    booking.bookingStatus === 'CANCELLED' ? 'bg-danger' : 'bg-warning'} px-3`}>
                                                {booking.bookingStatus === 'CANCEL_REQUESTED' ? 'Cancellation Requested' : booking.bookingStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`badge rounded-pill ${booking.paymentStatus === 'SUCCESS' ? 'bg-info bg-opacity-10 text-info border border-info' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary'} px-2`} style={{ fontSize: '0.7rem' }}>
                                                {booking.paymentStatus}
                                            </span>
                                            {booking.paidAmount < booking.totalAmount && booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'COMPLETED' && (
                                                <div className="mt-1 small text-muted">
                                                    Paid: ₹{booking.paidAmount} / ₹{booking.totalAmount}
                                                </div>
                                            )}
                                        </div>

                                        {/* Payment Buttons */}
                                        {booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'COMPLETED' && (
                                            <div className="d-flex flex-column gap-1">
                                                {/* Pay Deposit Button */}
                                                {(booking.paymentStatus === 'PENDING' || booking.paidAmount < booking.depositAmount) && (
                                                    <button
                                                        className="btn btn-success btn-sm py-0 mb-1"
                                                        style={{ fontSize: '0.75rem' }}
                                                        onClick={() => handlePayment(booking, 'DEPOSIT')}
                                                    >
                                                        Pay Deposit (₹{booking.depositAmount - booking.paidAmount > 0 ? booking.depositAmount - booking.paidAmount : booking.depositAmount})
                                                    </button>
                                                )}

                                                {/* Pay Remaining Button */}
                                                {(booking.paymentStatus === 'PARTIAL' || (booking.paidAmount >= booking.depositAmount && booking.paidAmount < booking.totalAmount)) && (
                                                    <button
                                                        className="btn btn-primary btn-sm py-0 mb-1"
                                                        style={{ fontSize: '0.75rem' }}
                                                        onClick={() => handlePayment(booking, 'REMAINING')}
                                                    >
                                                        Pay Remaining (₹{booking.totalAmount - booking.paidAmount})
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Pickup Confirmation Logic */}
                                        {(() => {
                                            const isConfirmed = booking.bookingStatus === 'CONFIRMED';
                                            if (!isConfirmed) return null;

                                            // Time check
                                            const [y, m, d] = booking.startingDate.split('-').map(Number);
                                            const [h, min] = booking.pickupTime.split(':').map(Number);
                                            const pickupDate = new Date(y, m - 1, d, h, min, 0);
                                            const now = new Date();

                                            if (now >= pickupDate) {
                                                return (
                                                    <div className="mt-2">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            style={{ fontSize: '0.75rem' }}
                                                            onClick={async () => {
                                                                if (window.confirm("Confirm that you have picked up the vehicle?")) {
                                                                    try {
                                                                        await BookingService.confirmPickup(booking.bookingId, userId);
                                                                        alert("Vehicle pickup confirmed!");
                                                                        setBookings(prev => prev.map(b => b.bookingId === booking.bookingId ? { ...b, bookingStatus: 'ONGOING' } : b));
                                                                    } catch (err) {
                                                                        console.error("Pickup confirmation failed", err);
                                                                        alert("Failed to confirm pickup: " + (err.response?.data?.message || err.message));
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Confirm Pickup
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            return null;
                                        })()}

                                        {/* Return Request Logic */}
                                        {booking.bookingStatus === 'ONGOING' && (
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-warning btn-sm text-dark"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={async () => {
                                                        if (window.confirm("Are you sure you want to return the vehicle? This will notify the owner.")) {
                                                            try {
                                                                await BookingService.requestReturn(booking.bookingId, userId);
                                                                alert("Return requested! Waiting for owner checks.");
                                                                setBookings(prev => prev.map(b => b.bookingId === booking.bookingId ? { ...b, bookingStatus: 'RETURN_REQUESTED' } : b));
                                                            } catch (err) {
                                                                console.error("Return request failed", err);
                                                                alert("Failed to request return: " + (err.response?.data?.message || err.message));
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Request Return
                                                </button>
                                            </div>
                                        )}
                                        {booking.bookingStatus === 'RETURN_REQUESTED' && (
                                            <div className="mt-2 small text-muted fst-italic">
                                                <i className="bi bi-hourglass-split me-1"></i>Waiting for Owner
                                            </div>
                                        )}

                                        {(() => {
                                            if (booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'COMPLETED') return null;

                                            // 2-day rule check
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            // Parse manually to ensure local time (YYYY-MM-DD -> Local Midnight)
                                            // booking.startingDate is "YYYY-MM-DD"
                                            const [y, m, d] = booking.startingDate.split('-').map(Number);
                                            const startDate = new Date(y, m - 1, d); // Month is 0-indexed

                                            // Fix: cancel button should hide if booked/ongoing/etc? 
                                            // Prompt doesn't say remove cancel, but usually you can't cancel if trip started.
                                            // Adding check: if ONGOING, don't show cancel.
                                            if (booking.bookingStatus === 'ONGOING' || booking.bookingStatus === 'CANCEL_REQUESTED') return null;

                                            const diffTime = startDate - today;
                                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                            const isEligible = diffDays >= 2;

                                            if (!isEligible) return null;

                                            return (
                                                <div className="mt-2">
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        style={{ fontSize: '0.75rem' }}
                                                        onClick={async () => {
                                                            const confirm = window.confirm("Are you sure you want to cancel this booking?");
                                                            if (confirm) {
                                                                try {
                                                                    console.log(`Attempting to cancel booking ${booking.bookingId} for user ${userId}`);
                                                                    await BookingService.cancelBooking(booking.bookingId, userId);
                                                                    setBookings(prev => prev.map(b => b.bookingId === booking.bookingId ? { ...b, bookingStatus: 'CANCEL_REQUESTED' } : b));
                                                                    alert("Cancellation requested! Waiting for owner approval.");
                                                                } catch (err) {
                                                                    console.error("Cancellation failed:", err);
                                                                    const reason = err.response?.data?.message || err.response?.data || "Failed to cancel booking.";
                                                                    alert(`Cancellation failed: ${reason}`);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }

            <style>{`
                .hover-link:hover {
                    text-decoration: underline;
                }
                .extra-small {
                    font-size: 0.75rem;
                }
            `}</style>
        </div >
    );
}

export default MyBookings;
