import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios"

function Signup(){

    const[name,setname]=useState("")
    const[email,setemail]=useState("")
    const[password,setpassword]=useState("")
    const[message,setmessage]=useState("")
    const[confirmpassword,setconfirmpassword]=useState("")
    const[showPassword,setShowPassword]=useState(false)
    const[showConfirmPassword,setShowConfirmPassword]=useState(false)
    const navigate=useNavigate()

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

     const handleSignup=async(e)=>{
        e.preventDefault()

         if(confirmpassword===password){
                 try
             {
           
            let req=await axios.post("/signup",{name,email,password})
            setmessage("Signup successful. Redirecting to login..."); 
             setTimeout(()=>{
                navigate("/login")
             },1500)
             console.log(req)
        }
        catch(err){
            setmessage("Signup Failed")
            throw new Error(err)
        }
            }
            else{
                alert("password dont match")
            }
       

     }

    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center 
        justify-center px-6 py-12">
            <div className="w-full max-w-md">
                
                {/* Card Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600 text-sm">Sign up for your Buyzen account</p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`p-4 rounded-lg mb-4 ${message.includes('Successful') ? 
                        'bg-green-100 text-green-800 border border-green-200' : 
                        'bg-red-100 text-red-800 border border-red-200'}`}>
                            {message}
                        </div>
                    )}

                    {/* Google Sign In/Up Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 font-medium text-sm shadow-sm cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-500 text-xs uppercase tracking-wider">Or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSignup}>
                        {/* Full Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                required 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                transition-all duration-200 text-sm"
                                onChange={(e)=>setname(e.target.value)}
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="you@example.com" 
                                required 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                                text-sm"
                                 onChange={(e)=>setemail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Create a strong password"
                                    required 
                                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                                    text-sm"
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

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirm your password"
                                    required 
                                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                    text-sm"
                                    onChange={(e)=>setconfirmpassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
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

                        {/* Terms Checkbox */}
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                required 
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
                            </label>
                        </div>

                        {/* Signup Button */}
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-semibold text-sm mt-6"
                        >
                            Sign Up
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <NavLink 
                        to="/login"
                        className="w-full border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-sm text-center block"
                    >
                        Sign In
                    </NavLink>
                </div>

                {/* Footer Text */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    By signing up, you agree to our <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
                </p>
            </div>
        </div>
    );
}
export default Signup