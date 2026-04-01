import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";

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
      setError(error.message || "Failed to load orders");
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
      setSuccess("Order status updated");
      fetchOrders();
    } catch (error) {
      setError(error.message || "Failed to update order status");
    }
  };

  return (
    <section>
      <h1>Admin Orders</h1>
      <p>Manage customer orders and delivery statuses.</p>

      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && <p>No orders found.</p>}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-card-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <p>
                <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Address:</strong> {order.deliveryAddress}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
              <p>
                <strong>Total:</strong> {order.totalPrice} ₸
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
                  Processing
                </button>
                <button
                  className="primary-btn small-btn"
                  onClick={() => handleStatusChange(order._id, "delivered")}
                >
                  Delivered
                </button>
                <button
                  className="danger-btn small-btn"
                  onClick={() => handleStatusChange(order._id, "cancelled")}
                >
                  Cancel
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
