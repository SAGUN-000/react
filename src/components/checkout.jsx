import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
 import LocationPicker from "./locationPicker.jsx";
 import useMessageBoxStore from "../store/MessageBoxStore.js";

const NEPAL_PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
]

const defaultAddress = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: 'Kathmandu',
  province: 'Bagmati Province',
  postalCode: '',
  country: 'Nepal',
}

export default function Checkout(){
     const { placeOrder, orderItems, orderSubtotal, fetchUserDetails, deleteCartItem, fetchCartItems } = useOutletContext()
     const navigate = useNavigate()

     // Form state
      const [shippingInfo, setShippingInfo] = useState({
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Nepal"
    });

     const [billingInfo, setBillingInfo] = useState({ ...defaultAddress })

     const [sameAsShipping, setSameAsShipping] = useState(true)
     const [paymentMethod, setPaymentMethod] = useState('card')
     const [isProcessing, setIsProcessing] = useState(false)
     const [location, setLocation] = useState(null);
     const { showMessage } = useMessageBoxStore();
   

     useEffect(() => {
       if (!orderItems || orderItems.length === 0) {
         navigate('/cart')
         return
       }
     }, [orderItems, navigate])

     useEffect(() => {
       fetchUserDetails?.().then((data) => {
         if (data) {
           setShippingInfo(prev => ({
             ...prev,
             firstName: data.firstName || prev.firstName,
             lastName: data.lastName || prev.lastName,
             email: data.email || prev.email,
           }))
         }
       }).catch(() => {})
     }, [fetchUserDetails])

     useEffect(() => {
       if (sameAsShipping) {
         setBillingInfo(shippingInfo)
       }
     }, [shippingInfo, sameAsShipping])

     const handleShippingChange = (e) => {
       const { name, value } = e.target
       setShippingInfo(prev => ({
         ...prev,
         [name]: value
       }))
     }

     const handleBillingChange = (e) => {
       const { name, value } = e.target
       setBillingInfo(prev => ({
         ...prev,
         [name]: value
       }))
     }

      const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!location) {
        showMessage(
            "Please select your delivery location on the map.",
            "warning"
        );
        setIsProcessing(false);
        return;
    }

    try {
        await placeOrder({
            orderItems,
            ...shippingInfo,
            latitude: location.latitude,
            longitude: location.longitude,
        });

        const productIds = orderItems.map(item => item.id);

        await deleteCartItem(productIds);
        await fetchCartItems(navigate);

        showMessage(
            "Order placed successfully!",
            "success"
        );

        navigate("/");

    } catch (error) {
        console.error("Checkout failed:", error);

        if (error.message === "UNAUTHORIZED") {
            showMessage(
                "Login expired. Please log in again.",
                "warning"
            );

            navigate("/login");
        } else {
            showMessage(
                error.response?.data?.message ||
                "Checkout failed. Please try again.",
                "error"
            );
        }

    } finally {
        setIsProcessing(false);
    }
};

     const total = Number(orderSubtotal) || 0

     return(
       <div className="min-h-screen bg-gray-50 py-12 px-6">
         <div className="max-w-6xl mx-auto">
           <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

           <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column - Forms */}
             <div className="lg:col-span-2 space-y-6">
               {/* Shipping Information */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                     <input
                       type="text"
                       name="firstName"
                       value={shippingInfo.firstName}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Ram"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                     <input
                       type="text"
                       name="lastName"
                       value={shippingInfo.lastName}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Sharma"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                     <input
                       type="email"
                       name="email"
                       value={shippingInfo.email}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="ram@example.com"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                     <input
                       type="tel"
                       name="phone"
                       value={shippingInfo.phone}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="9801234567"
                     />
                   </div>

                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                     <input
                       type="text"
                       name="address"
                       value={shippingInfo.address}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Thamel, Ward 29"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                     <input
                       type="text"
                       name="city"
                       value={shippingInfo.city}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Kathmandu"
                     />
                   </div>

                   {/* Map */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pin Delivery Location
                    </label>

                    <LocationPicker onLocationSelect={setLocation} />
                  </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                     <select
                       name="province"
                       value={shippingInfo.province}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                       {NEPAL_PROVINCES.map((province) => (
                         <option key={province} value={province}>{province}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                     <input
                       type="text"
                       name="postalCode"
                       value={shippingInfo.postalCode}
                       onChange={handleShippingChange}
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="44600"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                     <select
                       name="country"
                       value={shippingInfo.country}
                       onChange={handleShippingChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                       <option value="Nepal">Nepal</option>
                       <option value="India">India</option>
                       <option value="China">China</option>
                     </select>
                   </div>
                 </div>
               </div>

               {/* Billing Information */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-semibold text-gray-900">Billing Information</h2>
                   <label className="flex items-center space-x-2 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={sameAsShipping}
                       onChange={(e) => setSameAsShipping(e.target.checked)}
                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                     />
                     <span className="text-sm text-gray-700">Same as shipping</span>
                   </label>
                 </div>

                 {!sameAsShipping && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                       <input
                         type="text"
                         name="firstName"
                         value={billingInfo.firstName}
                         onChange={handleBillingChange}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Ram"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                       <input
                         type="text"
                         name="lastName"
                         value={billingInfo.lastName}
                         onChange={handleBillingChange}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Sharma"
                       />
                     </div>
                     <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                       <input
                         type="text"
                         name="address"
                         value={billingInfo.address}
                         onChange={handleBillingChange}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Thamel, Ward 29"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                       <input
                         type="text"
                         name="city"
                         value={billingInfo.city}
                         onChange={handleBillingChange}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Kathmandu"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                       <select
                         name="province"
                         value={billingInfo.province}
                         onChange={handleBillingChange}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       >
                         {NEPAL_PROVINCES.map((province) => (
                           <option key={province} value={province}>{province}</option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                       <input
                         type="text"
                         name="postalCode"
                         value={billingInfo.postalCode}
                         onChange={handleBillingChange}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="44600"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                       <select
                         name="country"
                         value={billingInfo.country}
                         onChange={handleBillingChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       >
                         <option value="Nepal">Nepal</option>
                         <option value="India">India</option>
                         <option value="China">China</option>
                       </select>
                     </div>
                   </div>
                 )}
               </div>

               {/* Payment Information */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                 <div className="space-y-4">
                   <div className="flex space-x-4">
                     <label className="flex items-center space-x-2 cursor-pointer">
                       <input
                         type="radio"
                         name="paymentMethod"
                         value="card"
                         checked={paymentMethod === 'card'}
                         onChange={(e) => setPaymentMethod(e.target.value)}
                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                       />
                       <span className="text-sm font-medium text-gray-700">Credit/Debit Card</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                       <input
                         type="radio"
                         name="paymentMethod"
                         value="paypal"
                         checked={paymentMethod === 'paypal'}
                         onChange={(e) => setPaymentMethod(e.target.value)}
                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                       />
                       <span className="text-sm font-medium text-gray-700">PayPal</span>
                     </label>
                   </div>

                   {paymentMethod === 'card' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                       <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                         <input
                           type="text"
                           required
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="1234 5678 9012 3456"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                         <input
                           type="text"
                           required
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="MM/YY"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                         <input
                           type="text"
                           required
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="123"
                         />
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>

             {/* Right Column - Order Summary */}
             <div className="space-y-6">
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                 {/* Order Items */}
                 <div className="space-y-4 mb-6">
                   {orderItems && orderItems.length > 0 ? (
                     orderItems.map((item, index) => (
                       <div key={index} className="flex items-center space-x-4">
                         {item.url && (
                           <img src={item.url} alt={item.name || item.product_name} className="w-16 h-16 bg-gray-100 rounded-lg object-cover object-center block" />
                         )}
                         <div className="flex-1">
                           <h3 className="text-sm font-medium text-gray-900">{item.name || item.product_name}</h3>
                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                           <p className="text-sm font-medium text-blue-600">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                         </div>
                       </div>
                     ))
                   ) : (
                     <p className="text-gray-600 text-sm">No items in order</p>
                   )}
                 </div>

                 {/* Order Totals */}
                 <div className="border-t border-gray-200 pt-4 space-y-2">
                   <div className="flex justify-between text-gray-700">
                     <span>Subtotal</span>
                     <span className="font-medium">${total.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-gray-700">
                     <span>Shipping</span>
                     <span className="font-medium">Free</span>
                   </div>
                   <div className="flex justify-between text-gray-700">
                     <span>Tax</span>
                     <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-gray-900 font-bold text-lg border-t border-gray-200 pt-2">
                     <span>Total</span>
                     <span>${(total + total * 0.08).toFixed(2)}</span>
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={isProcessing}
                   className={`w-full mt-6 font-semibold py-3 rounded-lg transition-colors duration-150 ${
                     isProcessing
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                       : 'bg-blue-600 hover:bg-blue-700 text-white'
                   }`}
                 >
                   {isProcessing ? 'Processing...' : 'Place Order'}
                 </button>
               </div>

               {/* Security Note */}
               <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                 <div className="flex items-start space-x-3">
                   <div className="flex-shrink-0">
                     <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M10 1L3 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-7-3z" clipRule="evenodd" />
                     </svg>
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-blue-900">Secure Checkout</h3>
                     <p className="text-sm text-blue-700 mt-1">
                       Your payment information is encrypted and secure. We never store your card details.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </form>
         </div>
       </div>
     )
}