import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OwnerBookingService from "../../api/OwnerBookingService";

function OwnerBookings() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const { userId } = useSelector((state) => state.auth);

    useEffect(() => {
        const id = userId || 2; // Fallback for dev

        async function fetchBookings() {
            try {
                setLoading(true);
                const data = await OwnerBookingService.getOwnerBookings(id);
                console.log("✅ Owner Bookings fetched:", data);
                setBookings(data);
                setFilteredBookings(data);
            } catch (err) {
                console.error("❌ Error fetching owner bookings:", err);
                setError("Failed to fetch bookings for your vehicles.");
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, [userId]);

    useEffect(() => {
        if (statusFilter === "ALL") {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(b => b.bookingStatus === statusFilter));
        }
    }, [statusFilter, bookings]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Fetching vehicle bookings...</p>
            </div>
        );
    }

    return (
        <div className="pb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
                <h2 className="mb-0">Vehicle Bookings</h2>
                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Bookings</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="ONGOING">Ongoing (Rented)</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCEL_REQUESTED">Cancellation Requests</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && <div className="alert alert-danger shadow-sm">{error}</div>}

            {filteredBookings.length === 0 ? (
                <div className="card text-center p-5 border-0 shadow-sm">
                    <div className="card-body">
                        <i className="bi bi-calendar-x text-muted" style={{ fontSize: "3rem" }}></i>
                        <h4 className="mt-3">No Bookings Found</h4>
                        <p className="text-muted">There are no bookings matching your criteria.</p>
                    </div>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded border">
                    <table className="table table-hover align-middle bg-white mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-3 text-uppercase small fw-bold text-muted">Booking</th>
                                <th className="text-uppercase small fw-bold text-muted">Vehicle</th>
                                <th className="text-uppercase small fw-bold text-muted">Customer</th>
                                <th className="text-uppercase small fw-bold text-muted">Dates & Time</th>
                                <th className="text-uppercase small fw-bold text-muted text-end">Amount</th>
                                <th className="text-uppercase small fw-bold text-muted text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td className="ps-3 font-monospace">
                                        <span className="fw-bold">#{booking.bookingId}</span>
                                        <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
                                            {new Date(booking.bookingDate).toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-dark">{booking.vehicleName}</div>
                                        <div className="text-muted small">{booking.vehicleNumber}</div>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-dark">{booking.customerName}</div>
                                        <div className="text-primary small">
                                            <i className="bi bi-telephone me-1"></i>
                                            {booking.customerPhone}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column gap-1">
                                            <div className="small">
                                                <span className="badge bg-light text-dark border me-1">From</span>
                                                {booking.startingDate} <span className="text-muted ms-1"><i className="bi bi-clock"></i> {booking.pickupTime}</span>
                                            </div>
                                            <div className="small">
                                                <span className="badge bg-light text-dark border me-1">To</span>
                                                {booking.endDate} <span className="text-muted ms-1"><i className="bi bi-clock"></i> {booking.returnTime}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <div className="fw-bold text-dark">₹{booking.totalAmount}</div>
                                        <div className="text-danger small" style={{ fontSize: '0.75rem' }}>
                                            Deposit: ₹{booking.depositAmount}
                                        </div>
                                        <div className="text-success small" style={{ fontSize: '0.75rem' }}>
                                            Paid: ₹{booking.paidAmount}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="mb-2">
                                            <span className={`badge rounded-pill ${booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'COMPLETED' ? 'bg-success' :
                                                booking.bookingStatus === 'PENDING' || booking.bookingStatus === 'ONGOING' ? 'bg-warning text-dark' :
                                                    booking.bookingStatus === 'RETURN_REQUESTED' || booking.bookingStatus === 'CANCEL_REQUESTED' ? 'bg-info text-dark' :
                                                        'bg-danger'
                                                } px-3`}>
                                                {booking.bookingStatus.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="small text-muted" style={{ fontSize: '0.7rem' }}>
                                            Payment: {booking.paymentStatus}
                                        </div>

                                        {booking.bookingStatus === 'CANCEL_REQUESTED' && (
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-warning btn-sm py-0 text-dark"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={async () => {
                                                        const refundAmt = (booking.paidAmount || 0); // Logic: Refund whatever matches PaidAmount
                                                        if (window.confirm(`Confirm Refund of ₹${refundAmt} for Booking #${booking.bookingId}? This will cancel the booking.`)) {
                                                            try {
                                                                const res = await OwnerBookingService.confirmRefund(booking.bookingId, userId);
                                                                console.log("Refund Confirmed:", res);
                                                                alert(`Refund Processed Successfully!\nState: CANCELLED\nRefunded: ₹${refundAmt}`);

                                                                // Update List
                                                                const updateBooking = (list) => list.map(b => b.bookingId === booking.bookingId ? { ...b, bookingStatus: 'CANCELLED', paymentStatus: 'REFUNDED' } : b);
                                                                setFilteredBookings(prev => updateBooking(prev));
                                                                setBookings(prev => updateBooking(prev));
                                                            } catch (err) {
                                                                console.error("Confirm refund failed", err);
                                                                alert("Failed to confirm refund: " + (err.response?.data || err.message));
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Confirm Refund
                                                </button>
                                            </div>
                                        )}

                                        {booking.bookingStatus === 'RETURN_REQUESTED' && (
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-success btn-sm py-0"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={async () => {
                                                        if (window.confirm(`Complete return for Booking #${booking.bookingId}? This will calculate final charges.`)) {
                                                            try {
                                                                const res = await OwnerBookingService.completeReturn(booking.bookingId, userId); // using userId as ownerId
                                                                console.log("Return completed:", res);
                                                                // Calculate settlement info for alert
                                                                const rent = res.totalAmount;
                                                                const payments = res.payments || [];
                                                                const settlement = payments.find(p => p.paymentType === 'REFUND' || p.paymentType === 'FINAL_DUE');

                                                                let msg = "Return Completed Successfully!\n";
                                                                msg += `Final Rent: ₹${rent}\n`;

                                                                if (settlement) {
                                                                    if (settlement.paymentType === 'REFUND') {
                                                                        msg += `Refund Processed: ₹${settlement.paymentAmount}`;
                                                                    } else if (settlement.paymentType === 'FINAL_DUE') {
                                                                        msg += `Final Due Amount: ₹${settlement.paymentAmount}`;
                                                                    }
                                                                } else {
                                                                    msg += "All payments settled. No further action required.";
                                                                }

                                                                alert(msg);

                                                                // Update both lists to reflect COMPLETED status immediately
                                                                const updateBooking = (list) => list.map(b => b.bookingId === booking.bookingId ? { ...b, bookingStatus: 'COMPLETED', paymentStatus: res.paymentStatus, vehicle: { ...b.vehicle, status: 'AVAILABLE' } } : b);

                                                                setFilteredBookings(prev => updateBooking(prev));
                                                                setBookings(prev => updateBooking(prev));
                                                            } catch (err) {
                                                                console.error("Complete return failed", err);
                                                                alert("Failed to complete return: " + (err.response?.data || err.message));
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Complete Return
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .font-monospace {
                    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
            `}</style>
        </div>
    );
}

export default OwnerBookings;
