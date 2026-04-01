import { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { uploadImage } from "../../services/uploadService";
import { getImageUrl } from "../../services/api";

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      setError(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock || "",
    });
    setSelectedFile(null);
    setPreviewUrl(product.image ? getImageUrl(product.image) : "");
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      let imagePath = formData.image;

      if (selectedFile) {
        setUploadingImage(true);
        const uploadResponse = await uploadImage(selectedFile);
        imagePath = uploadResponse.imageUrl;
        setUploadingImage(false);
      }

      const payload = {
        ...formData,
        image: imagePath,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccess("Product updated successfully");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      setError(error.message || "Failed to save product");
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteProduct(id);
      setSuccess("Product deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      fetchProducts();
    } catch (error) {
      setError(error.message || "Failed to delete product");
    }
  };

  return (
    <section>
      <h1>Admin Products</h1>
      <p>Create, edit and delete products for the catalog.</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Product title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Or paste image URL manually"
          value={formData.image}
          onChange={handleChange}
        />

        <div className="file-upload-block">
          <label className="file-label">Upload product image</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
          />
        </div>

        {previewUrl && (
          <div className="image-preview-box">
            <p>Image preview:</p>
            <img src={previewUrl} alt="Preview" className="image-preview" />
          </div>
        )}

        {error && <p className="message error-message">{error}</p>}
        {success && <p className="message success-message">{success}</p>}

        <div className="admin-form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={submitting || uploadingImage}
          >
            {uploadingImage
              ? "Uploading image..."
              : submitting
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Update Product"
              : "Create Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading && <p>Loading products...</p>}

      {!loading && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.title}
                      className="admin-product-thumb"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>{product.price} ₸</td>
                  <td>{product.stock}</td>
                  <td className="admin-actions-cell">
                    <button
                      className="primary-btn small-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn small-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminProductsPage;
