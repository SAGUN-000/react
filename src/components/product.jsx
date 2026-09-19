 import { NavLink, useNavigate } from "react-router-dom";
 import useMessageBoxStore from "../store/MessageBoxStore";

function Products({ id, name, price, url, addToCart }) {
  const navigate = useNavigate();
  const { showMessage } = useMessageBoxStore();

  const handleAddToCart = async () => {
    try {
        await addToCart({ id, name, price, url });

        showMessage("Added to cart successfully!", "success");

    } catch (err) {
        if (err.message === "AUTH_REQUIRED") {
            showMessage(
                "Please login to add items to cart.",
                "warning"
            );
            navigate("/login");

        } else if (err.message === "UNAUTHORIZED") {
            showMessage(
                "Your login session has expired. Please login again.",
                "warning"
            );
            navigate("/login");

        } else {
            showMessage(
                "Failed to add item to cart.",
                "error"
            );
        }
    }
};

  return (
    <div
      className="
        w-full max-w-[220px]
        bg-white
        rounded-lg
        overflow-hidden
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        hover:-translate-y-2
        flex flex-col
      "
    >
      <NavLink
        to={`/product_details/${id}`}
        state={{ product: { id, name, price, url } }}
        className="block"
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={url}
            alt={name}
            className="
              w-full
              h-full
              object-cover
              object-center
              hover:scale-110
              transition-transform
              duration-300
            "
          />
        </div>
      </NavLink>

      <div className="p-4 flex-1">
        <h3
          className="
            text-gray-900
            font-semibold
            text-base
            line-clamp-2
            min-h-[48px]
          "
        >
          {name}
        </h3>

        <p className="text-blue-600 font-bold text-lg mt-3">
          ${price}
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        className="
          w-full
          px-4
          py-3
          bg-blue-600
          text-white
          font-semibold
          hover:bg-blue-700
          active:bg-blue-800
          transition-all
          duration-200
          text-sm
          cursor-pointer
        "
      >
        Add to cart
      </button>
    </div>
  );
}

export default Products;