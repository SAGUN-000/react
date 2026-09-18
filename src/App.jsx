 import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout';
import Home from './header/home';
import Special from './header/special-offer';
import Contact from './header/contact-us';
import Login from './components/login';
import Signup from './components/signup';
import Cart from './components/cart';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Categories from './components/categories';
import ProductDetails from './components/productDetails';
import ProtectedRoute from './protected_routes/protectedRoute';
import axios from 'axios';
import Profile from './components/profile';
import Checkout from './components/checkout';
import ViewOrder from './components/viewOrder';
import AdminDashboard from './protected_routes/admin_dashboard';
import OrdersPage from './protected_routes/OrdersPage';
import OAuth2Success from './components/OAuth2Success';
import ChatPage from './pages/ChatPage';
import UpdatePasswordPage from './pages/updatepasswordPage';
import Messages from './protected_routes/UserMessages';
import AdminProfile from './protected_routes/adminProfile';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [subtotal,setCartSubtotal]=useState(0);
  const [userDetails,setuserDetails]=useState({})
  const[orderItems,setOrderItems]=useState([])
  const[orderSubtotal,setOrderSubtotal]=useState(0)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
   

  // ❌ NO navigation here
  // This function ONLY handles API logic
 const addToCart = async (item) => {
  const token = localStorage.getItem("jwt_token");

  if (!token) throw new Error("AUTH_REQUIRED");
  console.log("sending to backend: ",item)


  const res = await axios.post(
    "http://localhost:8080/cart/addtocart",
    item,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

   if (res.status === 401) {
      localStorage.removeItem('jwt_token');
      throw new Error("UNAUTHORIZED");
    }

  return res.data;
};

// get cart items

  const fetchCartItems = async (navigate) => {
  const token = localStorage.getItem('jwt_token');
  if (!token) return;

  const res = await fetch("http://localhost:8080/cart/view_cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    localStorage.removeItem('jwt_token');
    alert("please login first");
    navigate('/login', { replace: true }); // ← redirect on expired token
    return;
  }

  if (!res.ok) throw new Error("FETCH_FAILED");

  const data = await res.json();
  setCartItems(data.cartItemsDtoList || []);
  setCartSubtotal(data.subtotal || 0);
};

  //fetch products

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

   useEffect(() => {
  const fetchProducts = async () => {
    try {
      const pageNum = Math.max(1, currentPage + 1);

      const url = keyword
        ? `http://localhost:8080/products?keyword=${encodeURIComponent(keyword)}&pageNum=${pageNum}`
        : `http://localhost:8080/products?pageNum=${pageNum}`;

      const res = await axios.get(url);

      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotalPages(0);
    }
  };

  fetchProducts();
}, [keyword, currentPage]);
   
  //delete cartItems

  const deleteCartItem = async (productIds) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("AUTH_REQUIRED");

    const payload = Array.isArray(productIds) ? productIds : [productIds];

    try {
      const res = await axios.delete("http://localhost:8080/cart/delete_cartItem", {
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      });

      if (res.status === 401) {
        localStorage.removeItem('jwt_token');
        throw new Error("UNAUTHORIZED");
      }

      const data = res.data;
      setCartItems(data.cartItemsDtoList || []);
      setCartSubtotal(data.subtotal || 0);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fetchUserDetails = useCallback(async() => {
    try{
      const token = localStorage.getItem("jwt_token");
      if(!token) throw new Error("No token found");
      
      let res=await axios.get("http://localhost:8080/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setuserDetails(res.data);
      return res.data;
    }
    catch(err){
      console.log(err);
      throw err;
    }
  }, []);

  const prepareCheckout = (items) => {
    setOrderItems(items);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setOrderSubtotal(subtotal);
  };

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("No token found");

    const res = await axios.get("http://localhost:8080/order/view_order", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("ORDERS FROM BACKEND:", res.data);

    if (res.status === 401) {
      localStorage.removeItem('jwt_token');
      throw new Error("UNAUTHORIZED");
    }

    return res.data;
  }, []);
 
 const placeOrder = async (orderData) => {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    throw new Error("No token found");
  }

  if (
    orderData?.latitude == null ||
    orderData?.longitude == null
  ) {
    throw new Error("Please select your delivery location on the map");
  }

  const payload = {
    orderItems: orderData.orderItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),

    address: orderData.address,
    city: orderData.city,
    province: orderData.province,
    postalCode: orderData.postalCode,
    country: orderData.country,

    latitude: orderData.latitude,
    longitude: orderData.longitude,
  };

  console.log(payload)

  try {
    const res = await axios.post(
      "http://localhost:8080/order/checkout",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;

    setOrderItems(data.items || []);
    setOrderSubtotal(data.totalPrice || 0);

    return data;
  } catch (error) {
    console.error(
      "Place order failed:",
      error.response?.data || error.message
    );

    throw error;
  }
};

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          cartItems={cartItems}
          onCartClick={addToCart}
          deleteCartItem={deleteCartItem}
          keyword={keyword}
          setKeyword={setKeyword}
          products={products}
          subtotal={subtotal}
          fetchCartItems={fetchCartItems}
          fetchUserDetails={fetchUserDetails}
          prepareCheckout={prepareCheckout}
          placeOrder={placeOrder}
          fetchOrders={fetchOrders}
          orderItems={orderItems}
          orderSubtotal={orderSubtotal}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}

           
        />
      ),
      children: [
        { index: true, element: <Home /> },
        {
            path: "oauth2/success",
            element: <OAuth2Success />
        },
        { path: "special-offers", element: <Special /> },
        { path: "contact-us", element: <Contact /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Signup /> },
        { path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: "blogs", element: <Blogs /> },
        { path: "blogs/:slug", element: <BlogPost /> },
        { path: "categories/:slug", element: <Categories /> },
        { path: "product_details/:id", element: <ProductDetails /> },
        {path:"/profile",element:<Profile/>},
       
        {path:"/updatepassword",element:<ProtectedRoute><UpdatePasswordPage/></ProtectedRoute>},
        {path:"/chat/:chatId",element:<ChatPage/>},
        {path:"checkout",element:<ProtectedRoute><Checkout/></ProtectedRoute>},
        {path:"orders",element:<ProtectedRoute><ViewOrder/></ProtectedRoute>}
      ]
    },
    {
      path: "/admin",
      element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
    },
    {
      path: "/admin/orders",
      element: <ProtectedRoute><OrdersPage /></ProtectedRoute>
    },
    {
      path: "/admin/order",
      element: <ProtectedRoute><OrdersPage /></ProtectedRoute>
    },
    {
      path: "/admin/users/messages",
      element:<ProtectedRoute><Messages></Messages></ProtectedRoute>
    },
    {
      path:"/admin/messages/:userId",
      element:<ProtectedRoute><ChatPage></ChatPage></ProtectedRoute>
    },
    {
      path:"/admin/profile",
      element:<AdminProfile/>
    },
     {
      path:"/admin/update-password",
      element: <UpdatePasswordPage/>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;