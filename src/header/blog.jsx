function Blog(){
    return(
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
                <p className="text-gray-600 mb-8">Latest articles and insights from MyShop</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <article key={item} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-sm text-gray-500">Jan 29, 2026</span>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Blog Post {item}</h2>
                                <p className="text-gray-600 text-sm mb-4">Discover interesting tips and tricks to enhance your shopping experience.</p>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">Read More →</a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Blog
