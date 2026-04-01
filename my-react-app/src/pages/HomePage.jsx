import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Online Store Delivery Service</h1>
        <p>
          A fullstack web application for browsing products, adding them to cart,
          and placing delivery orders online.
        </p>

        <div className="hero-actions">
          <Link to="/catalog" className="primary-btn">
            Open Catalog
          </Link>
          <Link to="/cart" className="secondary-btn">
            View Cart
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
