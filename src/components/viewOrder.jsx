 import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import * as messageApi from "../API/MessageApi";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function getStatusStyle(status) {
  return statusStyles[status] || "bg-gray-100 text-gray-800";
}

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getItemName(item) {
  return (
    item.product_name ||
    item.name ||
    item.productName ||
    item.product?.name ||
    (item.productId ? `Product #${item.productId}` : "Unknown product")
  );
}

function getItemUrl(item) {
  return item.url || item.image || item.imageUrl || item.product?.url || "";
}

function getProductId(item) {
  const id = item.productId ?? item.product_id ?? item.product?.id;
  const num = Number(id);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function getOrderItems(order) {
  return order.items || order.orderItems || [];
}

function normalizeOrders(orders) {
  return orders.map((order) => ({
    ...order,
    items: getOrderItems(order).map((item) => ({
      ...item,
      productId: getProductId(item),
      product_name: item.product_name || item.productName || item.name || "",
      url: getItemUrl(item),
    })),
  }));
}

async function buildProductMap(productIds) {
  const token = localStorage.getItem("jwt_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const map = {};
  const needed = new Set(productIds.filter(Boolean));

  if (needed.size === 0) return map;

  try {
    let pageNum = 1;
    let totalPages = 1;

    while (pageNum <= totalPages && needed.size > 0) {
      const res = await axios.get(
        `http://localhost:8080/products?pageNum=${pageNum}`,
        { headers }
      );

      const products =
        res.data?.content ||
        (Array.isArray(res.data) ? res.data : []);

      totalPages = res.data?.totalPages || 1;

      products.forEach((product) => {
        const id = Number(product.id);

        if (needed.has(id)) {
          map[id] = product;
          needed.delete(id);
        }
      });

      pageNum++;

      if (!res.data?.content && !Array.isArray(res.data)) break;
    }
  } catch (err) {
    console.error("Failed to load product catalog:", err);
  }

  await Promise.all(
    [...needed].map(async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:8080/products/${id}`,
          { headers }
        );

        map[id] = res.data;
      } catch {
        // Ignore missing products
      }
    })
  );

  return map;
}

function enrichOrdersWithProducts(orders, productMap) {
  return orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      const productId = getProductId(item);
      const product = productId ? productMap[productId] : null;

      return {
        ...item,
        productId,
        product_name: item.product_name || product?.name || "",
        url: getItemUrl(item) || product?.url || "",
      };
    }),
  }));
}

function ViewOrder() {
  const { fetchOrders } = useOutletContext();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const data = await fetchOrders();

        const orderList = normalizeOrders(
          Array.isArray(data) ? data : []
        );

        const productIds = orderList.flatMap((order) =>
          order.items
            .filter((item) => !item.product_name || !item.url)
            .map((item) => getProductId(item))
            .filter(Boolean)
        );

        const productMap = await buildProductMap(productIds);

        setOrders(
          enrichOrdersWithProducts(orderList, productMap)
        );

        setError(null);
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          navigate("/login", { replace: true });
          return;
        }

        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [fetchOrders, navigate]);

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prev) =>
      prev === orderId ? null : orderId
    );
  };
 
  const handleChatWithSeller = async (sellerId) => {
  try {
    const chatId = await messageApi.getChatId(sellerId);

    navigate(`/chat/${chatId}`);
  } catch (err) {
    console.error("Failed to create chat:", err);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="text-gray-600 mt-2">
              {orders.length} order
              {orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>

          <Link
            to="/profile"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Back to Profile
          </Link>
        </div>

        {/* No orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">
              You have not placed any orders yet.
            </p>

            <Link
              to="/"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const itemCount = order.items?.length || 0;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >

                  {/* Order Header */}
                  <button
                    type="button"
                    onClick={() => toggleOrder(order.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">

                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order.id}
                        </p>

                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatPrice(order.totalPrice)}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          {itemCount} item
                          {itemCount !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status || "UNKNOWN"}
                        </span>

                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Order */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 px-6 pb-6">

                      {/* Delivery Location */}
                      <div className="py-5 border-b border-gray-200">
                        <div className="flex items-start gap-3">

                          <svg
                            className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Delivery Address
                            </p>

                            <p className="text-sm text-gray-700 mt-1">
                              {order.address || "Address not available"}
                            </p>

                            <p className="text-sm text-gray-600">
                              {[order.city, order.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                          {order.items.map((item, index) => (
                            <li
                              key={`${order.id}-${item.productId}-${index}`}
                              className="py-4 flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-4 min-w-0">

                                {getItemUrl(item) ? (
                                  <img
                                    src={getItemUrl(item)}
                                    alt={getItemName(item)}
                                    className="w-16 h-16 bg-gray-100 rounded-lg object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                                    <svg
                                      className="w-8 h-8 text-gray-400"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H5.25A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21Z"
                                      />
                                    </svg>
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {getItemName(item)}
                                  </p>

                                  <p className="text-sm text-gray-600 mt-1">
                                    Qty: {item.quantity} ×{" "}
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>

                              <p className="font-semibold text-blue-600 shrink-0">
                                {formatPrice(
                                  Number(item.price) * item.quantity
                                )}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="py-4 text-sm text-gray-500">
                          No items found for this order.
                        </p>
                      )}

                      {/* Order Total */}
                      <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between text-gray-900 font-bold">
                        <span>Order Total</span>
                        <span>{formatPrice(order.totalPrice)}</span>
                      </div>

                      {/* Chat with Seller */}
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => handleChatWithSeller(order.items[0].sellerId)}
                        className="group w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.8"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.625 9.75h6.75m-6.75 3h4.5m4.5 5.25a9 9 0 1 0-15.75-6.12c0 1.35.3 2.63.84 3.77L3 21l5.35-1.72a9 9 0 0 0 9.12-1.28Z"
                              />
                            </svg>
                          </div>

                          <div className="text-left">
                            <p className="text-sm font-semibold text-slate-800">
                              Chat with Seller
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Have a question about your order?
                            </p>
                          </div>
                        </div>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9 5 7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewOrder;