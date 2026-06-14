import { useEffect, useState } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import Products from "./product"


function Categories(){

    const {slug}=useParams()
    const navigate = useNavigate();
    const [products, setProducts]=useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const {onCartClick, cartItems } = useOutletContext();

    useEffect(() => {
      setCurrentPage(0);
    }, [slug]);

    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const pageNum = Math.max(1, currentPage + 1);
      const res = await fetch(`/products/category/${slug}?pageNum=${pageNum}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      // Ensure we always store an array in state. Handle paginated
      // shapes like { content: [...] } and common alternatives.
      const productsArray = Array.isArray(data)
        ? data
        : (data && Array.isArray(data.content))
        ? data.content
        : (data && Array.isArray(data.products))
        ? data.products
        : [];
      setProducts(productsArray);
      setTotalPages(data.totalPages || 0);
      if (productsArray.length) console.log(productsArray[0].url);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProducts();
}, [slug, currentPage]);

    return(
        <>
         <div className="bg-gray-50 w-full">
                <div className="flex-1 ml-5 mr-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/')}
                            aria-label="Go back to homepage"
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                        >
                            <span className="mr-2">←</span>
                            <span className="font-medium">Back</span>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 pl-8">{slug}</h2>
                    </div>
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

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 mt-8 pb-6">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Previous
                        </button>
                        
                        <span className="text-gray-700 font-medium">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage >= totalPages - 1 || totalPages === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Categories