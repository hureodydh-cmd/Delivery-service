import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getMyOrders } from "../services/orderService";

const statusLabels = {
  processing: "В обработке",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const getStatusLabel = (status) => statusLabels[status] || status;

const MyOrdersPage = () => {
  const { isAuthenticated, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Не удалось загрузить заказы");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section>
        <h1>Мои заказы</h1>
        <p>Вам нужно войти, чтобы просмотреть свои заказы.</p>
        <Link to="/login">Войти</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Мои заказы</h1>
      <p>Добро пожаловать, {user?.name}. Здесь история ваших заказов.</p>

      {loading && <Loader text="Загрузка заказов..." />}
      {error && <p className="message error-message">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="Заказов пока нет"
          text="Вы ещё не оформили ни одного заказа."
          buttonText="В каталог"
          buttonLink="/catalog"
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-card-header">
                <h3>Заказ №{order._id.slice(-6)}</h3>
                <span className={`order-status status-${order.status}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <p><strong>Адрес:</strong> {order.deliveryAddress}</p>
              <p><strong>Телефон:</strong> {order.phone}</p>
              <p><strong>Итого:</strong> {order.totalPrice} ₸</p>

              <div className="order-items">
                {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                  <div key={index} className="order-item">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>{item.price * item.quantity} ₸</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrdersPage;
