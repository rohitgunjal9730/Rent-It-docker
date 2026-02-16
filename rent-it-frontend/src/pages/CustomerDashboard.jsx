import { Link } from "react-router-dom";

function CustomerDashboard() {
  return (
    <div>
      <h1 className="mb-3 mb-md-4">Customer Dashboard</h1>

      <div className="row g-3 g-md-4">
        <div className="col-12 col-sm-6 col-lg-4 mb-3 mb-md-0">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-car-front me-2"></i>
                Browse Vehicles
              </h5>
              <p className="card-text">View all available vehicles for rent</p>
              <Link to="/customer/vehicles" className="btn btn-light">
                View Vehicles
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 mb-3 mb-md-0">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-calendar-check me-2"></i>
                My Bookings
              </h5>
              <p className="card-text">View and manage your bookings</p>
              <Link to="/customer/bookings" className="btn btn-light">
                View Bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 mb-3 mb-md-0">
          <div className="card text-white bg-info h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-person-circle me-2"></i>
                My Profile
              </h5>
              <p className="card-text">Update your profile information</p>
              <Link to="/customer/profile" className="btn btn-light">
                View Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-clock-history me-2"></i>
                Payment History
              </h5>
              <p className="card-text">View your past transactions</p>
              <Link to="/customer/payments/history" className="btn btn-light">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3 mt-md-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">
              <i className="bi bi-info-circle me-2"></i>
              Welcome to Rent-It!
            </h5>
            <p className="mb-0">
              Discover a wide range of bikes and cars available for rent.
              Browse our collection, book your favorite vehicle, and enjoy your ride!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;