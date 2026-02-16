import { useEffect, useState } from "react";
import api from "../../api/axios";

function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [bookingStats, setBookingStats] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [topTypes, setTopTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [dashRes, bookingsRes, revRes, topRes] = await Promise.all([
        api.get("/admin/analytics/dashboard"),
        api.get("/admin/analytics/bookings?period=daily&span=30"),
        api.get("/admin/analytics/revenue?months=6"),
        api.get("/admin/analytics/top-vehicle-types?limit=5")
      ]);

      setDashboard(dashRes.data);
      setBookingStats(bookingsRes.data);
      setRevenue(revRes.data);
      setTopTypes(topRes.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <div className="text-center py-5">Loading analytics...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-3 mb-md-4">Admin Analytics</h2>

      <div className="row g-3 mb-4">
        <div className="col-6 col-sm-4 col-md-2">
          <div className="card p-3 text-center">
            <div className="h5">Users</div>
            <div className="display-6">{dashboard?.totalUsers}</div>
          </div>
        </div>
        <div className="col-6 col-sm-4 col-md-2">
          <div className="card p-3 text-center">
            <div className="h5">Vehicles</div>
            <div className="display-6">{dashboard?.totalVehicles}</div>
          </div>
        </div>
        <div className="col-6 col-sm-4 col-md-2">
          <div className="card p-3 text-center">
            <div className="h5">Active</div>
            <div className="display-6">{dashboard?.activeBookings}</div>
          </div>
        </div>
        <div className="col-6 col-sm-4 col-md-2">
          <div className="card p-3 text-center">
            <div className="h5">Completed</div>
            <div className="display-6">{dashboard?.completedBookings}</div>
          </div>
        </div>
        <div className="col-6 col-sm-4 col-md-2">
          <div className="card p-3 text-center">
            <div className="h5">Cancelled</div>
            <div className="display-6">{dashboard?.cancelledBookings}</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <h5>Bookings (last 30 days)</h5>
          <table className="table table-sm">
            <thead>
              <tr><th>Day</th><th>Count</th></tr>
            </thead>
            <tbody>
              {bookingStats.map(b => (
                <tr key={b.period}><td>{b.period}</td><td>{b.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-12 col-md-6">
          <h5>Revenue (last 6 months)</h5>
          <table className="table table-sm">
            <thead>
              <tr><th>Period</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {revenue.map(r => (
                <tr key={r.period}><td>{r.period}</td><td>₹{r.revenue}</td></tr>
              ))}
            </tbody>
          </table>

          <h5 className="mt-4">Top Vehicle Types</h5>
          <ul>
            {topTypes.map(t => (
              <li key={t.vehicleTypeName}>{t.vehicleTypeName} — {t.bookingsCount} bookings</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
