function Contact(){
    return(
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
                <p className="text-gray-600 mb-8">We'd love to hear from you. Send us a message!</p>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                            <input type="email" placeholder="You@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                            <textarea placeholder="Your message here..." rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )

}
export default Contact