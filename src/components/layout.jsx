 import { Outlet } from "react-router-dom";
 
import Navbar from "../header/navbar";
import Footer from "../footer/footer";
import MessageBox from "./messageBox";

function Layout({ cartItems, onCartClick,deleteCartItem ,keyword, setKeyword, 
  products, subtotal, fetchCartItems,fetchUserDetails, prepareCheckout, placeOrder, fetchOrders, orderItems,orderSubtotal, currentPage, setCurrentPage, totalPages}) {
  

  return (
    <>
     
    
    <Navbar keyword={keyword} setkeyword={setKeyword} cartItems={cartItems} />
    <MessageBox/>
    
       
      <Outlet context={{ products, cartItems, deleteCartItem,onCartClick, subtotal,
        fetchCartItems,fetchUserDetails, prepareCheckout, placeOrder, fetchOrders, orderItems, orderSubtotal, currentPage, setCurrentPage, totalPages}} />

      <Footer/>
    </>
  );
}

export default Layout;