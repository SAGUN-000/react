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

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [subtotal,setCartSubtotal]=useState(0);
  const [userDetails,setuserDetails]=useState({})
  const[orderItems,setOrderItems]=useState([])
  const[orderSubtotal,setOrderSubtotal]=useState(0)
   

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
    const fetchProducts = async () => {
     

      try {
        const url = keyword
          ? `http://localhost:8080/products/${keyword}`
          : `http://localhost:8080/products`;


        const res = await axios.get(url);
         
        
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [keyword]);

   
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

  const checkout=async(items)=>{
    console.log("Checkout function called with items:", items);

    try{
       const token=localStorage.getItem("jwt_token")
       console.log("Token found:", !!token);
      if(!token) throw new Error("No token found");

      console.log("Making API call to checkout...");
      let res=await axios.post("http://localhost:8080/order/checkout",items,{
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("API response:", res);

      if (res.status === 401) {
        localStorage.removeItem('jwt_token');
        throw new Error("UNAUTHORIZED");
    }

      setOrderItems(res.items || []);
      setOrderSubtotal(res.totalPrice || 0)
      console.log("Order items set:", res.items);
      console.log("Order subtotal set:", res.totalPrice);

    }
    catch(err){
      console.error("Checkout function error:", err);
      throw err;
    }
   


  }

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
          checkout={checkout}
          orderItems={orderItems}
          orderSubtotal={orderSubtotal}

           
        />
      ),
      children: [
        { index: true, element: <Home /> },
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
        {path:"checkout",element:<ProtectedRoute><Checkout/></ProtectedRoute>}
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;