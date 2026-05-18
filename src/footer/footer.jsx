import React from 'react';

function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-black border-t-4 border-blue-600 py-16 px-8 text-gray-100 animate-slide-in-up">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 animate-fade-in-delay-1 transform transition-all duration-500 hover:-translate-y-1">
                        <div className="mb-4 inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <h3 className="text-2xl font-black text-white">Buyzen</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs hover:text-gray-300 transition-colors duration-300">Your ultimate destination for quality products at unbeatable prices. Discover thousands of items from trusted sellers worldwide.</p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-125 transform shadow-lg"><span className="text-white text-sm font-bold">f</span></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-125 transform shadow-lg"><span className="text-white text-sm font-bold">𝕏</span></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-125 transform shadow-lg"><span className="text-white text-sm font-bold">in</span></a>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div className="animate-fade-in-delay-2 transform transition-all duration-500 hover:-translate-y-1">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-500 rounded"></div>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Home</a></li>
                            <li><a href="/special-offers" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Special Offers</a></li>
                            <li><a href="/contact-us" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Contact Us</a></li>
                            <li><a href="/blogs" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Blogs</a></li>
                        </ul>
                    </div>
                    {/* Support */}
                    <div className="animate-fade-in-delay-3 transform transition-all duration-500 hover:-translate-y-1">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-500 rounded"></div>
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ FAQ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Shipping Info</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm font-medium inline-block">→ Track Order</a></li>
                        </ul>
                    </div>
                    {/* Newsletter */}
                    <div className="animate-fade-in transform transition-all duration-500 hover:-translate-y-1">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-500 rounded"></div>
                            Newsletter
                        </h4>
                        <p className="text-gray-400 text-xs mb-4">Subscribe to get special offers and updates</p>
                        <div className="flex">
                            <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 bg-gray-800 text-white text-xs rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-r-lg transition-all duration-300 hover:shadow-lg transform active:scale-95">Subscribe</button>
                        </div>
                    </div>
                </div>
                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-xs animate-fade-in">
                    <p className="hover:text-gray-300 transition-colors duration-300">© 2026 Buyzen. All rights reserved | Made with ❤️</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
                        <a href="#" className="hover:text-blue-400 transition-colors duration-300">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
