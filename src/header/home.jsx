 import { NavLink, useOutletContext } from "react-router-dom";
import Products from "../components/product";

function Home() {
    const { products, onCartClick, cartItems } = useOutletContext();

    return (
        <>
            <div className="flex gap-8 p-6 bg-gradient-to-b from-blue-50 to-white">

                <div className="w-64 h-1/2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                    <ul className="space-y-3">
                        <NavLink to="/categories/electronics">
                            <li className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md cursor-pointer
                             transition-colors duration-200">Electronics</li>
                        </NavLink>
                        <NavLink to="/categories/fashion">
                            <li className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md cursor-pointer 
                            transition-colors duration-200">Fashion</li>
                        </NavLink>
                        <NavLink to="/categories/beautyCare">
                            <li className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md cursor-pointer
                             transition-colors duration-200">Beauty & Care</li>
                        </NavLink>
                        <NavLink to="/categories/software">
                            <li className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md cursor-pointer 
                            transition-colors duration-200">Software & Digital</li>
                        </NavLink>
                        <NavLink to="/categories/accessories">
                            <li className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md cursor-pointer 
                            transition-colors duration-200">Accessories</li>
                        </NavLink>
                    </ul>
                </div>

                <div className="flex-1 ml-5">
                    <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop" alt="banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        <div className="absolute inset-0 flex flex-col justify-center items-start p-12 text-white">
                            <div className="mb-4 bg-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                🔥 LIMITED TIME OFFER
                            </div>
                            <h1 className="text-5xl font-bold mb-3 leading-tight">
                                50% OFF<br/>Everything
                            </h1>
                            <p className="text-xl mb-6 text-gray-100">
                                Shop now and save on thousands of products
                            </p>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                Shop Now →
                            </button>
                            <p className="text-sm text-gray-200 mt-4">
                                Offer valid until end of month. Limited stocks available.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 w-full">
                <div className="flex-1 ml-5 mr-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-8">Featured Products</h2>
                    <div className="flex p-4 flex-wrap gap-2">
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

export default Home;