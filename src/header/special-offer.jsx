function Special(){
    const offers = [
        {
            id: 1,
            title: "Summer Collection",
            discount: "40%",
            price: "$19.99",
            originalPrice: "$33.99",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
            category: "Fashion"
        },
        {
            id: 2,
            title: "Electronics Sale",
            discount: "35%",
            price: "$149.99",
            originalPrice: "$229.99",
            image: " https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvbmV8ZW58MHx8MHx8fDA%3D",
            category: "Tech"
        },
        {
            id: 3,
            title: "Home Essentials",
            discount: "50%",
            price: "$24.99",
            originalPrice: "$49.99",
            image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=400&fit=crop",
            category: "Home"
        },
        {
            id: 4,
            title: "Sportswear",
            discount: "30%",
            price: "$39.99",
            originalPrice: "$57.99",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop",
            category: "Sports"
        },
        {
            id: 5,
            title: "Beauty Products",
            discount: "45%",
            price: "$14.99",
            originalPrice: "$27.99",
            image: " https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D",
            category: "Beauty"
        },
        {
            id: 6,
            title: "Accessories",
            discount: "55%",
            price: "$9.99",
            originalPrice: "$22.99",
            image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=400&fit=crop",
            category: "Accessories"
        }
    ];

    return(
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">Special Offers</h1>
                    <p className="text-gray-600 text-lg">
                    Discover exclusive deals and limited-time offers on your favorite products</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-xl shadow-md
                         hover:shadow-xl transition-all duration-300 
                         overflow-hidden transform hover:-translate-y-2">
                            
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-gray-200">
                                <img 
                                    src={offer.image} 
                                    alt={offer.title}
                                    className="w-full h-full object-cover 
                                    hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4 bg-red-600 text-white 
                                px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    Save {offer.discount}
                                </div>
                                <div className="absolute top-4 right-4 bg-blue-600 
                                text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {offer.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">Limited time offer - Shop now and get exclusive discounts on premium items</p>
                                
                                {/* Price Section */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl font-bold text-green-600">{offer.price}</span>
                                    <span className="text-lg text-gray-500 line-through">{offer.originalPrice}</span>
                                </div>

                                {/* CTA Button */}
                                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default Special