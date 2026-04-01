import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getAllProducts } from "../services/productService";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      if (!product) return false;

      return (
        product.title?.toLowerCase().includes(searchValue) ||
        product.category?.toLowerCase().includes(searchValue)
      );
    });
  }, [products, searchTerm]);

  return (
    <section>
      <h1>Каталог</h1>
      <p>Смотреть товары, выбирать продукты и готовиться к вкусным покупкам.</p>

      <div className="catalog-toolbar">
        <input
          type="text"
          placeholder="Поиск по названию или категории"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="catalog-search"
        />
      </div>

      {loading && <Loader text="Loading products..." />}
      {error && <p className="message error-message">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState
          title="No products found"
          text="Try another search or add products from the admin panel."
          buttonText="Go Home"
          buttonLink="/"
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CatalogPage;
