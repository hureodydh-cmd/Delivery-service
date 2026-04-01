import { Link } from "react-router-dom";
import { getImageUrl } from "../services/api";
import EmptyState from "../components/ui/EmptyState";
import useCart from "../hooks/useCart";

const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <section>
        <h1>Корзина</h1>
        <EmptyState
          title="Ваша корзина пуста"
          text="Добавьте товары из каталога перед оформлением заказа."
          buttonText="Перейти в каталог"
          buttonLink="/catalog"
        />
      </section>
    );
  }

  return (
    <section>
      <div className="cart-header">
        <h1>Корзина</h1>
        <button className="danger-btn" onClick={clearCart}>
          Очистить корзину
        </button>
      </div>

      <div className="cart-list">
        {cartItems.map((item) => (
          <article key={item._id} className="cart-item">
            <img
              src={getImageUrl(item.image)}
              alt={item.title}
              className="cart-item-image"
              loading="lazy"
            />

            <div className="cart-item-content">
              <h3>{item.title}</h3>
              <p className="product-category">{item.category}</p>
              <p className="product-price">{item.price} ₸</p>
            </div>

            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item._id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <p className="cart-item-total">{item.price * item.quantity} ₸</p>

              <button
                className="danger-btn small-btn"
                onClick={() => removeFromCart(item._id)}
              >
                Удалить
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Итого: {totalPrice} ₸</h2>
        <Link to="/checkout" className="primary-btn checkout-link">
          Оформить заказ
        </Link>
      </div>
    </section>
  );
};

export default CartPage;
