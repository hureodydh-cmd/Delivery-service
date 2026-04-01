import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          Ща все сделаем
        </Link>

        <nav className="nav-links">
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/cart">Корзина ({totalItems})</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile/orders">Мои заказы</Link>

              {user?.role === "admin" && (
                <>
                  <Link to="/admin/products">Управление товарами</Link>
                  <Link to="/admin/orders">Заказы админа</Link>
                </>
              )}

              <span className="user-name">Привет, {user?.name}</span>
              <button className="logout-btn" onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
