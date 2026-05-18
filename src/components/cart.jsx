 import { useEffect, useState } from "react";
 import { useNavigate, useOutletContext } from "react-router-dom";

function Cart() {
  // Get cart state from Layout
  const { cartItems, subtotal, fetchCartItems, checkout, deleteCartItem } = useOutletContext();
  const navigate = useNavigate();

  console.log("Cart component - checkout function:", typeof checkout, checkout);

  // State for selected items
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    fetchCartItems(navigate); // ← actually load cart data
  }, []);

  useEffect(() => {
    setSelectedItems(prev => {
      const ids = new Set(cartItems.map(item => item.id));
      const next = new Set([...prev].filter(id => ids.has(id)));
      return next;
    });
  }, [cartItems]);

  // Handle checkbox change
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  // Calculate selected items subtotal
  const selectedSubtotal = cartItems
    .filter(item => selectedItems.has(item.id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  // Safely compute total
  const total = subtotal;

 async function handleBuyNow() {
   console.log("handleBuyNow called");
   console.log("selectedItems:", selectedItems);
   console.log("checkout function:", typeof checkout);

   if (selectedItems.size === 0) {
     alert("Please select at least one item to checkout");
     return;
   }

   // Prepare selected items for checkout
   const itemsToCheckout = cartItems
     .filter(item => selectedItems.has(item.id))
     .map(item => ({
       productId: item.id,
       quantity: item.quantity
     }));

   console.log("itemsToCheckout:", itemsToCheckout);

   try {
     console.log("Calling checkout function...");
     await checkout(itemsToCheckout);
     console.log("Checkout function completed successfully");
     navigate('/checkout');
   } catch (error) {
     console.error("Checkout failed:", error);
     alert("Checkout failed. Please try again.");
   }
 }

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      setSelectedItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      await fetchCartItems(navigate);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
        </p>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">Your cart is empty</p>
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Select All Checkbox */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-900 font-medium">
                    Select All Items ({selectedItems.size} of {cartItems.length} selected)
                  </span>
                </label>
              </div>

              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-6">
                    {/* Checkbox */}
                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>

                    <img src={item.url} alt={item.name} className="w-24 h-24 bg-gray-100 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-blue-600 font-bold text-xl mt-2">${item.price}</p>
                      <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 font-semibold ml-4 self-start"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit max-w-sm">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Selected Items ({selectedItems.size})</span>
                  <span className="font-medium">${selectedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-2">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>${selectedSubtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={selectedItems.size === 0}
                className={`w-full mt-6 font-semibold py-3 rounded-lg transition-colors duration-150 ${
                  selectedItems.size === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {selectedItems.size === 0 ? 'Select Items to Checkout' : `Checkout ${selectedItems.size} Item${selectedItems.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;