import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios"

const getJwtClaims = (token) => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return {};
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) base64 += '=';
        const decoded = atob(base64);
        return JSON.parse(decoded);
    } catch (error) {
        console.error('JWT parse error:', error);
        return {};
    }
};

function Login(){

         
        const[email,setemail]=useState("")
        const[password,setpassword]=useState("")
         const[message,setmessage]=useState("")
         const[showPassword,setShowPassword]=useState(false)
         const navigate = useNavigate()

        const handleLogin=async(e)=>{
        e.preventDefault()

        try
        {
            let res = await axios.post("/login", { email, password })
            
            // Extract JWT token from response
            const token = res.data.token || res.data.jwt || res.data.access_token || res.data.data?.token || res.data;
            
            // Store token in localStorage for authentication
            if (token) {
                localStorage.setItem('jwt_token', token);
                console.log('JWT Token extracted:', token);
            }

            const claims = token ? getJwtClaims(token) : {};
            console.log('JWT claims:', claims);
            const roleClaim = claims.role || claims.roles || claims.Role || claims.Roles ||
                claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
            const candidateRoles = Array.isArray(roleClaim) ? roleClaim : [roleClaim].filter(Boolean);
            const normalizedRoles = candidateRoles.map((role) => String(role).toLowerCase());
            const isAdmin = normalizedRoles.includes('admin') ||
                normalizedRoles.includes('administrator') ||
                claims.isAdmin === true ||
                claims.admin === true ||
                String(claims.isAdmin).toLowerCase() === 'true';
            const destination = isAdmin ? '/admin' : '/';

            console.log('roleClaim:', roleClaim, 'normalizedRoles:', normalizedRoles, 'isAdmin:', isAdmin);
            setmessage(`login successful. Redirecting to ${destination === '/admin' ? 'dashboard' : 'home'}...`);
            setTimeout(() => {
                navigate(destination, { replace: true });
            }, 1200);
        }
        catch(err){
            setmessage("Login Failed")
            console.error("Login error:", err)
        }

     }

    
    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600 text-sm">Sign in to your Buyzen account</p>
                    </div>
                    {/* Message Display */}
                    {message && (
                        <div className={`p-4 rounded-lg mb-4 ${message.toLowerCase().includes('successful') ? 
                        'bg-green-100 text-green-800 border border-green-200' : 
                        'bg-red-100 text-red-800 border border-red-200'}`}>
                            {message}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="you@example.com" 
                                required 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                                duration-200 text-sm"
                                onChange={(e)=>setemail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                    transition-all duration-200 text-sm"
                                    onChange={(e)=>setpassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium 
                            transition-colors duration-200">Forgot password?</a>
                        </div>

                        {/* Login Button */}
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 
                            transition-all duration-200 font-semibold text-sm mt-6"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <NavLink 
                        to="/signup"
                        className="w-full border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg
                         hover:bg-blue-50 transition-all duration-200 font-semibold text-sm text-center block"
                    >
                        Create Account
                    </NavLink>
                </div>

                {/* Footer Text */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    By signing in, you agree to our <a href="#" className="text-blue-600 hover:text-blue-700 
                    font-medium">Terms of Service</a>
                </p>
            </div>
        </div>
    );
}
export default Login