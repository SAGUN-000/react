import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';

const getJwtClaims = (token) => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return {};

        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) base64 += '=';

        return JSON.parse(atob(base64));
    } catch (error) {
        console.error('JWT parse error in profile:', error);
        return {};
    }
};

const getProfileInitial = (username) => {
    if (!username) return 'U';
    const trimmed = String(username).trim();
    return trimmed ? trimmed[0].toUpperCase() : 'U';
};

function Profile(){
    const { fetchUserDetails } = useOutletContext();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchUserDetails();
                const token = localStorage.getItem('jwt_token');
                const claims = token ? getJwtClaims(token) : {};

                setUserDetails({
                    ...claims,
                    ...data,
                    username: data?.username || data?.name || claims?.username || claims?.name || (claims?.userId ? `User ${claims.userId}` : undefined),
                    email: data?.email || data?.sub || claims?.email || claims?.sub,
                    userId: data?.userId || claims?.userId,
                    role: data?.role || claims?.role,
                });
                setError(null);
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError(err.message || 'Failed to fetch user details');
                setUserDetails(null);
            } finally {
                setLoading(false);
            }
        };

        if (fetchUserDetails) {
            loadUserDetails();
        }
    }, [fetchUserDetails]);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-gray-600'>Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-red-600'>Error: {error}</div>
            </div>
        );
    }

    return(
        <div className='min-h-screen bg-slate-50 py-16 px-4'>
            <div className='max-w-md mx-auto'>
                {/* Profile Card */}
                <div className='bg-white rounded-[28px] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] border border-slate-100'>
                    {/* Header */}
                    <div className='mb-8 flex flex-col items-center text-center'>
                        <div className='relative mb-5'>
                            <div className='w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                                {getProfileInitial(userDetails?.username)}
                            </div>
                            <button type='button' className='absolute -right-1 top-2 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors duration-200' aria-label='Edit profile image'>
                                <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M16.862 3.487a1.875 1.875 0 0 1 2.651 2.651L9.694 16.957a4.5 4.5 0 0 1-1.897 1.13l-3.386 1.128a.75.75 0 0 1-.948-.948l1.128-3.386a4.5 4.5 0 0 1 1.13-1.897L16.862 3.487ZM15.75 5.414 6.72 14.444c-.35.35-.623.775-.801 1.243l-.69 2.07 2.07-.69a3 3 0 0 0 1.242-.801l9.03-9.03-1.822-1.822Z' />
                                </svg>
                            </button>
                        </div>
                        <h1 className='text-3xl font-bold text-slate-900'>{userDetails?.username || 'My Profile'}</h1>
                    </div>

                    {/* Content */}
                    {userDetails ? (
                        <div className='space-y-4'>
                            {/* Username Section */}
                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>
                                <p className='text-xs font-medium text-slate-400 mb-1'>Username</p>
                                <p className='text-base font-semibold text-slate-900'>
                                    {userDetails.username || 'N/A'}
                                </p>
                            </div>

                            {/* Email Section */}
                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>
                                <p className='text-xs font-medium text-slate-400 mb-1'>Email</p>
                                <p className='text-base font-semibold text-slate-900 break-all'>
                                    {userDetails.email || 'N/A'}
                                </p>
                            </div>

                            <Link to='/orders' className='block rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors duration-200'>
                                <div className='flex items-center gap-3 text-slate-900 font-semibold'>
                                    <svg className='w-5 h-5 text-blue-600 shrink-0' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.8' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 13.5V17m0 0v3.375a1.125 1.125 0 0 0 2.25 0V17m-2.25 0H12m3 0h3.75m-13.5-7.5V5.625c0-.621.504-1.125 1.125-1.125h11.25c.621 0 1.125.504 1.125 1.125V12M6 12h12M6 12v6.375c0 .621.504 1.125 1.125 1.125h4.5' />
                                    </svg>
                                    <span>View Orders</span>
                                </div>
                            </Link>

                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>
                                <div className='flex items-center gap-3 text-slate-900 font-semibold'>
                                    <svg className='w-5 h-5 text-blue-600 shrink-0' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.8' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 10.5V6a4.5 4.5 0 0 0-9 0v4.5m9 0h-9m9 0a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18v-6a1.5 1.5 0 0 1 1.5-1.5m9 0h-9' />
                                    </svg>
                                    <span>Security</span>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className='w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-full shadow-sm transition-all duration-200'
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className='text-center py-6'>
                            <p className='text-slate-600'>No user details available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile