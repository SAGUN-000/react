import { useParams, Link } from 'react-router-dom'
import blogs from '../../data/blogs.json'

function BlogPost() {
  const { slug } = useParams()

  function findPost(slugParam) {
    if (!slugParam) return null
    const decoded = decodeURIComponent(slugParam || '').toString()
    const normalized = decoded.trim().toLowerCase()

    // try exact match, case-insensitive, id match, and relaxed space/dash match
    return blogs.find((p) => {
      if (!p || !p.slug) return false
      const s = String(p.slug).toLowerCase()
      if (s === normalized) return true
      if (String(p.id) === slugParam) return true
      if (s.replace(/-/g, ' ') === normalized.replace(/-/g, ' ')) return true
      return false
    })
  }

  const post = findPost(slug)
  if (!post) {
    // helpful debug output when running locally
    // eslint-disable-next-line no-console
    console.warn('BlogPost: slug not found ->', slug)
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Post not found</h2>
          <p className="text-gray-600 mt-2">We couldn't find the article you're looking for.</p>
          <Link to="/blogs" className="text-blue-600 mt-4 inline-block">Back to blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=No+Image'; }}
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
        <div className="mb-4 text-sm text-gray-500">{post.date}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-8">
          <Link to="/blogs" className="text-blue-600 hover:text-blue-700">← Back to articles</Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
