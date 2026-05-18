import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
                setUserDetails(data);
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
        <div className='min-h-screen bg-white py-16 px-4'>
            <div className='max-w-md mx-auto'>
                {/* Profile Card */}
                <div className='bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 shadow-sm border border-slate-200'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='text-3xl font-bold text-slate-900'>My Profile</h1>
                        <p className='text-slate-500 text-sm mt-2'>Account information</p>
                    </div>

                    {/* Content */}
                    {userDetails ? (
                        <div className='space-y-6'>
                            {/* Username Section */}
                            <div>
                                <p className='text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2'>Username</p>
                                <p className='text-lg font-semibold text-slate-900'>
                                    {userDetails.username || userDetails.name || 'N/A'}
                                </p>
                            </div>

                            {/* Email Section */}
                            <div className='border-t border-slate-200 pt-6'>
                                <p className='text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2'>Email</p>
                                <p className='text-lg font-semibold text-slate-900'>
                                    {userDetails.email || 'N/A'}
                                </p>
                            </div>

                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className='w-full mt-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200'
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