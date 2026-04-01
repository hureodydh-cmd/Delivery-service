import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="not-found-page">
      <h1>404</h1>
      <p>Страница не найдена.</p>
      <div className="not-found-actions">
        <Link to="/" className="primary-btn">
          На главную
        </Link>
        <Link to="/catalog" className="secondary-btn">
          В каталог
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
