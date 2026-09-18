 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../store/adminStore.js';

const getProfileInitial = (username) => {
    if (!username) return 'A';

    const trimmed = String(username).trim();

    return trimmed
        ? trimmed[0].toUpperCase()
        : 'A';
};

function AdminProfile() {

    const navigate = useNavigate();
    console.log("ADMIN STORE:", useAdminStore.getState());

    const {
        profile,
        loadingProfile,
        error,
        fetchProfile
    } = useAdminStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };


    if (loadingProfile) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-gray-600'>
                    Loading profile...
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-red-600'>
                    Error: {error}
                </div>
            </div>
        );
    }


    return (
        <div className='min-h-screen bg-slate-50 py-16 px-4'>

            <div className='max-w-md mx-auto'>

                {/* Back to Dashboard */}
                    <button
                        type='button'
                        onClick={() => navigate('/admin')}
                        className='mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200'
                    >
                        <svg
                            className='w-5 h-5'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='2'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 19.5 8.25 12l7.5-7.5'
                            />
                        </svg>

                        Back
                    </button>

                {/* Profile Card */}
                <div className='bg-white rounded-[28px] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] border border-slate-100'>

                    {/* Header */}
                    <div className='mb-8 flex flex-col items-center text-center'>

                        <div className='relative mb-5'>

                            {/* Avatar */}
                            <div className='w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                                {getProfileInitial(profile?.username)}
                            </div>

                            {/* Edit Button */}
                            <button
                                type='button'
                                className='absolute -right-1 top-2 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors duration-200'
                                aria-label='Edit profile image'
                            >
                                <svg
                                    className='w-4 h-4'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='currentColor'
                                >
                                    <path d='M16.862 3.487a1.875 1.875 0 0 1 2.651 2.651L9.694 16.957a4.5 4.5 0 0 1-1.897 1.13l-3.386 1.128a.75.75 0 0 1-.948-.948l1.128-3.386a4.5 4.5 0 0 1 1.13-1.897L16.862 3.487ZM15.75 5.414 6.72 14.444c-.35.35-.623.775-.801 1.243l-.69 2.07 2.07-.69a3 3 0 0 1 1.242-.801l9.03-9.03-1.822-1.822Z' />
                                </svg>
                            </button>

                        </div>


                        <h1 className='text-3xl font-bold text-slate-900'>
                            {profile?.username || 'Admin Profile'}
                        </h1>

                        <p className='mt-1 text-sm font-medium text-blue-600'>
                            Administrator
                        </p>

                    </div>


                    {/* Content */}
                    {profile ? (

                        <div className='space-y-4'>

                            {/* Username */}
                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>

                                <p className='text-xs font-medium text-slate-400 mb-1'>
                                    Username
                                </p>

                                <p className='text-base font-semibold text-slate-900'>
                                    {profile.username || 'N/A'}
                                </p>

                            </div>


                            {/* Email */}
                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>

                                <p className='text-xs font-medium text-slate-400 mb-1'>
                                    Email
                                </p>

                                <p className='text-base font-semibold text-slate-900 break-all'>
                                    {profile.email || 'N/A'}
                                </p>

                            </div>


                            {/* Role */}
                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>

                                <p className='text-xs font-medium text-slate-400 mb-1'>
                                    Role
                                </p>

                                <p className='text-base font-semibold text-slate-900'>
                                    {profile.role || 'ADMIN'}
                                </p>

                            </div>


                            {/* Authentication Provider */}
                            <div className='rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50'>

                                <p className='text-xs font-medium text-slate-400 mb-1'>
                                    Authentication
                                </p>

                                <p className='text-base font-semibold text-slate-900'>
                                    {profile.authProviderType || 'LOCAL'}
                                </p>

                            </div>


                            {/* Change Password */}
                            {profile.authProviderType === 'GOOGLE' ? (

                                <div
                                    className='block rounded-2xl border border-slate-200 px-5 py-4 bg-slate-100 opacity-60 cursor-not-allowed'
                                    aria-disabled='true'
                                >

                                    <div className='flex items-center justify-between'>

                                        <div className='flex items-center gap-3 text-slate-500 font-semibold'>

                                            <svg
                                                className='w-5 h-5 text-slate-400 shrink-0'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth='1.8'
                                                stroke='currentColor'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M16.5 10.5V6a4.5 4.5 0 0 0-9 0v4.5m9 0h-9m9 0a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18v-6a1.5 1.5 0 0 1 1.5-1.5m9 0h-9'
                                                />
                                            </svg>

                                            <span>
                                                Security (Change Password)
                                            </span>

                                        </div>


                                        <span className='text-xs font-semibold text-slate-400'>
                                            Unavailable
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                <button
                                    type='button'
                                    onClick={() => navigate('/admin/update-password')}
                                    className='w-full block rounded-2xl border border-slate-200 px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 text-left'
                                >

                                    <div className='flex items-center justify-between'>

                                        <div className='flex items-center gap-3 text-slate-900 font-semibold'>

                                            <svg
                                                className='w-5 h-5 text-blue-600 shrink-0'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth='1.8'
                                                stroke='currentColor'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M16.5 10.5V6a4.5 4.5 0 0 0-9 0v4.5m9 0h-9m9 0a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18v-6a1.5 1.5 0 0 1 1.5-1.5m9 0h-9'
                                                />
                                            </svg>

                                            <span>
                                                Security (Change Password)
                                            </span>

                                        </div>

                                        <span className='text-xs font-semibold text-blue-600'>
                                            Update →
                                        </span>

                                    </div>

                                </button>

                            )}


                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className='w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-full shadow-sm transition-all duration-200'
                            >
                                Logout
                            </button>

                        </div>

                    ) : (

                        <div className='text-center py-6'>

                            <p className='text-slate-600'>
                                No profile details available
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminProfile;
 
