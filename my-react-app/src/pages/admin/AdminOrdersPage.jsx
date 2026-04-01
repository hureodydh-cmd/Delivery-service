import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";

const statusLabels = {
  processing: "В обработке",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const getStatusLabel = (status) => statusLabels[status] || status;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      setError(error.message || "Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError("");
      setSuccess("");

      await updateOrderStatus(orderId, newStatus);
      setSuccess("Статус заказа обновлён");
      fetchOrders();
    } catch (error) {
      setError(error.message || "Не удалось обновить статус заказа");
    }
  };

  return (
    <section>
      <h1>Управление заказами</h1>
      <p>Управляйте заказами клиентов и статусами доставки.</p>

      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      {loading && <p>Загрузка заказов...</p>}

      {!loading && orders.length === 0 && <p>Заказы не найдены.</p>}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-card-header">
                <h3>Заказ #{order._id.slice(-6)}</h3>
                <span className={`order-status status-${order.status}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <p>
                <strong>Покупатель:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Адрес:</strong> {order.deliveryAddress}
              </p>
              <p>
                <strong>Телефон:</strong> {order.phone}
              </p>
              <p>
                <strong>Итого:</strong> {order.totalPrice} ₸
              </p>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>{item.price * item.quantity} ₸</span>
                  </div>
                ))}
              </div>

              <div className="status-actions">
                <button
                  className="primary-btn small-btn"
                  onClick={() => handleStatusChange(order._id, "processing")}
                >
                  В обработке
                </button>
                <button
                  className="primary-btn small-btn"
                  onClick={() => handleStatusChange(order._id, "delivered")}
                >
                  Доставлен
                </button>
                <button
                  className="danger-btn small-btn"
                  onClick={() => handleStatusChange(order._id, "cancelled")}
                >
                  Отменить
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrdersPage;
