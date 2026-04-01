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
        <h1>Оформление заказа</h1>
        <p>Для оформления заказа необходимо войти в систему.</p>
        <Link to="/login" className="details-link">
          Войти
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section>
        <h1>Оформление заказа</h1>
        <p>Ваша корзина пуста. Добавьте товары перед оформлением заказа.</p>
        <Link to="/catalog" className="details-link">
          В каталог
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
      setError("Пожалуйста, заполните адрес доставки и телефон");
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

      setSuccess("Заказ оформлен успешно");
      clearCart();

      setTimeout(() => {
        navigate("/profile/orders");
      }, 1200);
    } catch (error) {
      setError(error.message || "Не удалось оформить заказ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-section">
      <h1>Оформление заказа</h1>
      <p>Заполните данные доставки, чтобы завершить оформление заказа.</p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Адрес доставки
            <input
              type="text"
              name="deliveryAddress"
              placeholder="Введите адрес доставки"
              value={formData.deliveryAddress}
              onChange={handleChange}
            />
          </label>

          <label>
            Номер телефона
            <input
              type="text"
              name="phone"
              placeholder="Введите номер телефона"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          {error && <p className="message error-message">{error}</p>}
          {success && <p className="message success-message">{success}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Оформление заказа..." : "Оформить заказ"}
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
