import { Link } from "react-router-dom";
import { getImageUrl } from "../../services/api";
import useCart from "../../hooks/useCart";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <img
        src={getImageUrl(product.image)}
        alt={product.title}
        className="product-card-image"
        loading="lazy"
      />

      <div className="product-card-body">
        <h3>{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{product.price} ₸</p>
        <p className="product-stock">В наличии: {product.stock}</p>

        <div className="product-card-actions">
          <button
            className="primary-btn"
            onClick={() => addToCart(product)}
          >
            Добавить в корзину
          </button>

          <Link to={`/products/${product._id}`} className="details-link">
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
