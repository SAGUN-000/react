 import { Outlet } from "react-router-dom";
 
import Navbar from "../header/navbar";
import Footer from "../footer/footer";

function Layout({ cartItems, onCartClick,deleteCartItem ,keyword, setKeyword, 
  products, subtotal, fetchCartItems,fetchUserDetails,checkout,orderItems,orderSubtotal}) {
  

  return (
    <>
     
    
    <Navbar keyword={keyword} setkeyword={setKeyword} cartItems={cartItems} />
    
       
      <Outlet context={{ products, cartItems, deleteCartItem,onCartClick, subtotal,
        fetchCartItems,fetchUserDetails, checkout, orderItems, orderSubtotal}} />

      <Footer/>
    </>
  );
}

export default Layout;