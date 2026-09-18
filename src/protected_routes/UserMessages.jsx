 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

 import useAdminStore from "../store/adminStore";


const Messages = () => {

    const navigate = useNavigate();

 const {
    loadingUserChats,
    error,
    fetchUsersWithChats,
} = useAdminStore();

const userChats = useAdminStore((state) => state.userChats);

console.log("USER CHATS:", userChats);

    const [search, setSearch] = useState("");


    /*
     * Load users who have conversations with admin
     */

    useEffect(() => {

        fetchUsersWithChats();

    }, [fetchUsersWithChats]);


    /*
     * Search customers by name
     */
    console.log("userChats in Messages:", userChats);

    const filteredChats = userChats.filter((chat) =>
        chat.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );


    /*
     * Open conversation
     */

    const openChat = (chat) => {

        navigate(`/admin/messages/${chat.userId}`, {
            state: {
                chatId: chat.chatId,
                userName: chat.name,
            },
        });

    };


    return (

        <div className="min-h-screen bg-slate-50 py-6 px-4 md:px-6">

            <div className="max-w-5xl mx-auto">

                {/* =========================
                    PAGE HEADER
                ========================= */}

                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>

                    Back 
                </button>

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Messages
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage conversations with your customers
                    </p>

                </div>


                {/* =========================
                    MAIN CARD
                ========================= */}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


                    {/* =========================
                        SEARCH
                    ========================= */}

                    <div className="p-4 border-b border-slate-200">

                        <div className="relative max-w-md">

                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                                />

                            </svg>


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search customers..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />

                        </div>

                    </div>


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loadingUserChats && (

                        <div className="flex flex-col items-center justify-center py-20">

                            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />

                            <p className="text-sm font-medium text-slate-500 mt-3">
                                Loading conversations...
                            </p>

                        </div>

                    )}


                    {/* =========================
                        ERROR
                    ========================= */}

                    {!loadingUserChats && error && (

                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">

                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center">

                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m0 3.75h.008M10.29 3.86 2.82 17.25a1.875 1.875 0 0 0 1.63 2.812h15.1a1.875 1.875 0 0 0-1.63-2.812L13.71 3.86a1.875 1.875 0 0 0-3.42 0Z"
                                    />

                                </svg>

                            </div>


                            <h3 className="mt-4 text-base font-semibold text-slate-900">
                                Unable to load messages
                            </h3>


                            <p className="mt-1 text-sm text-slate-500">
                                {error}
                            </p>


                            <button
                                onClick={fetchUsersWithChats}
                                className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {!loadingUserChats &&
                        !error &&
                        filteredChats.length === 0 && (

                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">

                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">

                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                    >

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.584.233 2.707 1.626 2.707 3.228v.21a.75.75 0 0 0 1.154.63 5.972 5.972 0 0 0 3.035-1.078A9.764 9.764 0 0 0 12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25-9 3.694-9 8.25c0 1.6.467 3.093 1.258 4.37"
                                        />

                                    </svg>

                                </div>


                                <h3 className="mt-4 text-base font-semibold text-slate-900">

                                    {search
                                        ? "No customers found"
                                        : "No conversations yet"
                                    }

                                </h3>


                                <p className="mt-1 text-sm text-slate-500 max-w-sm">

                                    {search
                                        ? "Try searching with a different customer name."
                                        : "Customers who start a conversation will appear here."
                                    }

                                </p>

                            </div>

                        )}


                    {/* =========================
                        CHAT LIST
                    ========================= */}

                    {!loadingUserChats &&
                        !error &&
                        filteredChats.length > 0 && (

                            <div>

                                {filteredChats.map((chat) => (

                                    <button
                                        key={chat.chatId}
                                        type="button"
                                        onClick={() => openChat(chat)}
                                        className="w-full flex items-center gap-4 px-5 py-4 text-left border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors duration-150"
                                    >

                                        {/* AVATAR */}

                                        <div className="w-12 h-12 shrink-0 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">

                                            {chat.name
                                                ?.charAt(0)
                                                ?.toUpperCase()
                                            }

                                        </div>


                                        {/* USER INFO */}

                                        <div className="flex-1 min-w-0">

                                            <div className="flex items-center justify-between gap-3">

                                                <h3 className="text-sm font-semibold text-slate-900 truncate">

                                                    {chat.name}

                                                </h3>

                                            </div>


                                            <p className="text-sm text-slate-500 truncate mt-1">

                                                {chat.recentMessage?.trim()
                                                    ? chat.recentMessage
                                                    : "No messages yet"
                                                }

                                            </p>

                                        </div>


                                        {/* ARROW */}

                                        <svg
                                            className="w-5 h-5 text-slate-300 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m9 5 7 7-7 7"
                                            />

                                        </svg>

                                    </button>

                                ))}

                            </div>

                        )}

                </div>

            </div>

        </div>

    );
};


export default Messages;
 
