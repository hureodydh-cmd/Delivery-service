import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getImageUrl } from "../services/api";
import { getProductById } from "../services/productService";
import Loader from "../components/ui/Loader";
import useCart from "../hooks/useCart";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        setError(error.message || "Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
    setSuccessMessage("Товар добавлен в корзину");

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  if (loading) {
    return (
      <section>
        <h1>Подробности товара</h1>
        <Loader text="Загрузка товара..." />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>Подробности товара</h1>
        <p className="message error-message">{error}</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <h1>Подробности товара</h1>
        <p>Товар не найден.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="product-details">
        <img
          src={getImageUrl(product.image)}
          alt={product.title}
          className="product-details-image"
          loading="lazy"
        />

        <div className="product-details-content">
          <h1>{product.title}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-price">{product.price} ₸</p>
          <p className="product-stock">В наличии: {product.stock}</p>

          {successMessage && (
            <p className="message success-message">{successMessage}</p>
          )}

          <button className="primary-btn add-cart-btn" onClick={handleAddToCart}>
            Добавить в корзину
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
