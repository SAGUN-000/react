import { Link } from 'react-router-dom'
import blogs from '../../data/blogs.json'

function Blogs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">Latest articles and insights from Buyzen</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-48 bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=No+Image'; }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <Link to={`/blogs/${post.slug}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">Read More →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blogs
