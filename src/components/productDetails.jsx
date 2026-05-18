import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { onCartClick } = useOutletContext();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (product || !id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`http://localhost:8080/products/${id}`);
        if (response?.data) {
          setProduct(response.data);
        } else {
          throw new Error("No product data returned");
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, product]);

  const handleCartAction = async (isBuyNow = false) => {
    if (!onCartClick) return;
    setAdding(true);
    setFeedback("");

    try {
      await onCartClick({
        id: product.id,
        name: product.name,
        price: product.price,
        url: product.url,
        quantity,
      });
      setFeedback("Item added to cart.");

      if (isBuyNow) {
        navigate("/cart");
      }
    } catch (err) {
      if (err.message === "AUTH_REQUIRED" || err.message === "UNAUTHORIZED") {
        alert("Please login to continue.");
        navigate("/login");
      } else {
        alert("Failed to add item to cart. Please try again.");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-700">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-gray-700">Product not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2 bg-white rounded-3xl shadow-lg p-6">
        <div className="rounded-3xl overflow-hidden border border-gray-200">
          <img
            src={product.url}
            alt={product.name}
            className="w-full h-full object-cover min-h-[320px]"
          />
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-semibold text-blue-600 mb-6">
              ${product.price}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {product.description || product.details || "No description available for this product."}
            </p>
          </div>

          <div className="space-y-3">
            {product.category && (
              <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm uppercase tracking-wide text-gray-500">Category</p>
                <p className="text-lg font-medium text-gray-900">{product.category}</p>
              </div>
            )}

            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {feedback && <p className="text-sm text-green-600">{feedback}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleCartAction(false)}
                  disabled={adding}
                  className="w-full sm:w-auto flex-1 px-5 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  type="button"
                  onClick={() => handleCartAction(true)}
                  disabled={adding}
                  className="w-full sm:w-auto flex-1 px-5 py-3 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition disabled:cursor-not-allowed disabled:bg-green-300"
                >
                  {adding ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
