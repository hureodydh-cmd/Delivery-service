import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import { createOrder } from "../services/orderService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    deliveryAddress: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) {
    return (
      <section>
        <h1>Checkout</h1>
        <p>You need to log in before placing an order.</p>
        <Link to="/login" className="details-link">
          Go to Login
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>
        <p>Your cart is empty. Add products before checkout.</p>
        <Link to="/catalog" className="details-link">
          Go to Catalog
        </Link>
      </section>
    );
  }

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.deliveryAddress || !formData.phone) {
      setError("Please fill in delivery address and phone");
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      deliveryAddress: formData.deliveryAddress,
      phone: formData.phone,
    };

    try {
      setLoading(true);

      await createOrder(orderPayload);

      setSuccess("Order placed successfully");
      clearCart();

      setTimeout(() => {
        navigate("/profile/orders");
      }, 1200);
    } catch (error) {
      setError(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-section">
      <h1>Checkout</h1>
      <p>Fill in your delivery information to complete the order.</p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Delivery address
            <input
              type="text"
              name="deliveryAddress"
              placeholder="Enter delivery address"
              value={formData.deliveryAddress}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone number
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          {error && <p className="message error-message">{error}</p>}
          {success && <p className="message success-message">{success}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <strong>{item.price * item.quantity} ₸</strong>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Total</span>
            <strong>{totalPrice} ₸</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
