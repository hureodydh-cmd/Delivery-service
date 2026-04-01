import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="not-found-page">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <div className="not-found-actions">
        <Link to="/" className="primary-btn">
          Go Home
        </Link>
        <Link to="/catalog" className="secondary-btn">
          Open Catalog
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
