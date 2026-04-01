import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getMyOrders } from "../services/orderService";

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
        setError(error.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section>
        <h1>My Orders</h1>
        <p>You need to log in to view your orders.</p>
        <Link to="/login">Go to Login</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>My Orders</h1>
      <p>Welcome, {user?.name}. Here is your order history.</p>

      {loading && <Loader text="Loading orders..." />}
      {error && <p className="message error-message">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          text="You have not placed any orders yet."
          buttonText="Go to Catalog"
          buttonLink="/catalog"
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-card-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <p><strong>Address:</strong> {order.deliveryAddress}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Total:</strong> {order.totalPrice} ₸</p>

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
