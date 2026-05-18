 import {Link, NavLink} from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar({keyword, setkeyword}){

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp < currentTime;
        } catch (err) {
            return true;
        }
    };

    const checkLoginStatus = () => {
        const token = localStorage.getItem("jwt_token");
        if (token && token.length > 0) {
            if (isTokenExpired(token)) {
                localStorage.removeItem("jwt_token");
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
            }
        } else {
            setIsLoggedIn(false);
        }
    };


 useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => checkLoginStatus();
    
    // Poll every second to check if token is still valid
    const pollInterval = setInterval(() => {
        checkLoginStatus();
    }, 1000);

    window.addEventListener("storage", handleStorageChange);

    return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearInterval(pollInterval);
    };
}, []);

    return(
        <header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center'>
            <div className='flex items-center'>
                <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer'>
                    <span className='text-white font-bold text-sm text-center leading-tight'>Buyzen</span>
                </div>
            </div>

            <nav>
                <ul className='flex space-x-8'>
                    <li><NavLink to={'/'} className={({ isActive }) => 
                        `relative text-slate-700 hover:text-slate-900 transition-colors duration-200 no-underline py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:rounded-full after:bg-blue-600 after:origin-left after:transition-transform after:duration-200 after:ease-out ${isActive ? 'font-semibold text-slate-900 after:scale-x-100' : 'after:scale-x-0'}`}>
                        Home
                    </NavLink></li>
                    <li><NavLink to={'/special-offers'} className={({ isActive }) => 
                        `relative text-slate-700 hover:text-slate-900 transition-colors duration-200 no-underline py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:rounded-full after:bg-blue-600 after:origin-left after:transition-transform after:duration-200 after:ease-out ${isActive ? 'font-semibold text-slate-900 after:scale-x-100' : 'after:scale-x-0'}`}>
                        Special Offers
                    </NavLink></li>
                    <li><NavLink to={'/contact-us'} className={({ isActive }) => 
                        `relative text-slate-700 hover:text-slate-900 transition-colors duration-200 no-underline py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:rounded-full after:bg-blue-600 after:origin-left after:transition-transform after:duration-200 after:ease-out ${isActive ? 'font-semibold text-slate-900 after:scale-x-100' : 'after:scale-x-0'}`}>
                        Contact us
                    </NavLink></li>
                    <li><NavLink to={'/blogs'} className={({ isActive }) => 
                        `relative text-slate-700 hover:text-slate-900 transition-colors duration-200 no-underline py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:rounded-full after:bg-blue-600 after:origin-left after:transition-transform after:duration-200 after:ease-out ${isActive ? 'font-semibold text-slate-900 after:scale-x-100' : 'after:scale-x-0'}`}>
                        Blogs
                    </NavLink></li>
                </ul>
            </nav>

            <div className='w-full max-w-[360px] min-w-[260px] h-11 bg-white border border-slate-200 shadow-sm rounded-full px-3 flex items-center min-w-0 focus-within:ring-2 focus-within:ring-blue-200/30 focus-within:shadow-sm'>
                <svg className="w-5 h-5 text-slate-400 mr-3" xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" placeholder='Search'
                className='navbar-search-input flex-1 min-w-0 h-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none' 
                value={keyword} onChange={(e) => setkeyword(e.target.value)}/>
            </div>

            <div className='flex items-center gap-4'>
                <Link to={'/cart'}>
                    <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
                        <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </Link>
                
                {isLoggedIn ? (
                    <Link to={'/profile'}>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
                            <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                    </Link>
                ) : (
                    <Link to={'/login'}>
                        <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'>
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Navbar