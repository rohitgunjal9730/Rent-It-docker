import { Link } from 'react-router-dom';
import './Home.css';
import heroBg from '../assets/hero_bg.png';

export default function Home() {
    const features = [
        {
            id: 1,
            icon: "⚡",
            title: "Instant Booking",
            desc: "Book your dream car in seconds with our seamless digital platform."
        },
        {
            id: 2,
            icon: "🛡️",
            title: "Fully Insured",
            desc: "Drive with peace of mind knowing every trip is comprehensively insured."
        },
        {
            id: 3,
            icon: "💎",
            title: "Premium Fleet",
            desc: "Choose from an exclusive collection of luxury and sports vehicles."
        }
    ];



    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div
                    className="hero-bg"
                    style={{ backgroundImage: `url(${heroBg})` }}
                ></div>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1 className="hero-title">Drive the Extraordinary</h1>
                    <p className="hero-subtitle">Experience the thrill of premium mobility. Rent top-tier vehicles for your next adventure.</p>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Choose Rent-It</h2>
                <div className="features-grid">
                    {features.map(feature => (
                        <div key={feature.id} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-4 py-md-5 text-center" style={{ background: '#1e1e1e', color: 'white' }}>
                <h2 className="mb-3 mb-md-4">Ready to hit the road?</h2>
                <Link to="/register" className="cta-button" style={{ background: 'white', color: '#ff4d30' }}>Join Now</Link>
            </section>
        </div>
    );
}