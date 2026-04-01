import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="hero-section">
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1>Интернет-магазин с доставкой</h1>
          <p>
            Полноценное приложение для просмотра товаров, добавления в корзину
            и оформления доставки онлайн.
          </p>

          <div className="hero-actions">
            <Link to="/catalog" className="primary-btn">
              Открыть каталог
            </Link>
            <Link to="/cart" className="secondary-btn">
              Посмотреть корзину
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img src="/kartinki/volchok.png" alt="Интернет-магазин" />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
