import { useEffect, useState } from "react";
import PaymentService from "../../services/PaymentService";
import { useSelector } from "react-redux";

function CustomerPaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userId) return;
        async function fetchHistory() {
            try {
                const data = await PaymentService.getPaymentHistory(userId);
                setPayments(data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [userId]);

    if (loading) return <div className="container mt-5 text-center">Loading...</div>;

    return (
        <div className="pb-4">
            <h2 className="mb-3 mb-md-4">Payment History</h2>
            {payments.length === 0 ? (
                <div className="alert alert-info">No booking payments found.</div>
            ) : (
                <div className="table-responsive shadow-sm rounded bg-white">
                    <table className="table table-hover mb-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Booking ID</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.paymentId}>
                                    <td>{p.paymentId}</td>
                                    <td>#{p.booking?.bookingId}</td>
                                    <td className="fw-bold">₹{p.paymentAmount}</td>
                                    <td>{p.paymentMethod}</td>
                                    <td>{new Date(p.paymentDate).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${p.paymentStatus === 'SUCCESS' ? 'bg-success' : 'bg-warning'}`}>
                                            {p.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{p.paymentType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CustomerPaymentHistory;
