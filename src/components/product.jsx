import { NavLink, useNavigate } from "react-router-dom";
function Products({id,name,price,url,addToCart}){
  const navigate = useNavigate();

   const handleAddToCart = async () => {
  try {
    await addToCart({ id, name, price, url});
    alert("Added to cart");
  } catch (err) {
    if (err.message === "AUTH_REQUIRED") {
      alert("please login to add items in cart");
      navigate("/login");
    } 
    else if(err.message==="UNAUTHORIZED"){
      alert("login expired");
      navigate("/login");
    }
    else {
      alert("Failed to add item");
    }
  }
};
  
    return(
         <div className="w-full max-w-[220px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">

         {/*image container */}
         <NavLink
           to={`/product_details/${id}`}
           state={{ product: { id, name, price, url } }}
           className="block"
         >
           <div className="h-56 overflow-hidden">
             <img src={url} alt={name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/>
           </div>
         </NavLink>

        {/*text container */}
        <div className="p-4 flex-grow">
             <h3 className="text-gray-900 font-semibold text-base line-clamp-2">{name}</h3>
             <p className="text-blue-600 font-bold text-lg mt-3">${price}</p>
        </div>

         {/*button*/}
     <button
               className="w-full px-4 py-3 bg-blue-600 text-white font-semibold
               hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 rounded-b-lg
               text-sm cursor-pointer shadow-md hover:shadow-lg"
               onClick={handleAddToCart}
               >
               Add to cart
     </button>
               
    </div>
    )
}
export default Products