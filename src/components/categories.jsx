import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Products from "./product"
import { useOutletContext } from "react-router-dom"


function Categories(){

    const {slug}=useParams()
    const [products, setProducts]=useState([])
    const {onCartClick, cartItems } = useOutletContext();

    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(`/products/category/${slug}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setProducts(data);
      console.log(data[0].url)
    } catch (err) {
      console.error(err);
    }
  };

  fetchProducts();
}, [slug]); // add slug here if it can change

    return(
        <>
         <div className="bg-gray-50 w-full">
                <div className="flex-1 ml-5 mr-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-8">{slug}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
                        {products.map((product, index) =>
                            <Products
                                key={`${product.id}-${index}`}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                url={product.url}
                                addToCart={onCartClick}
                                cartitems={cartItems}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Categories