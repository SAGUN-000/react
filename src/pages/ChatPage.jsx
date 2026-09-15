 
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useMessageStore from "../store/MessageStore.js";

import {
    sendMessage,
    connect,
    disconnect,
    subscribeToMessages
} from "../socket/socketClient.js";


const ChatPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        chatId: chatIdParam,
        userId: userIdParam
    } = useParams();

    const state = location.state;

    /*
     * ==========================================
     * ADMIN / CUSTOMER CHAT
     * ==========================================
     *
     * Admin:
     * /admin/messages/:userId
     *
     * Customer:
     * /chat/:chatId
     */

    const isAdminChat = Boolean(userIdParam);

    /*
     * Admin gets chatId from navigation state.
     *
     * Customer gets chatId directly from URL.
     */

    const chatId = isAdminChat
        ? Number(state?.chatId)
        : Number(chatIdParam);

    /*
     * Admin:
     * receiver = customer
     *
     * Customer:
     * receiver = seller/support
     */

    const receiverId = isAdminChat
        ? Number(userIdParam)
        : Number(state?.sellerId);

    /*
     * Name displayed in header.
     */

    const otherUserName = isAdminChat
        ? state?.userName || "Customer"
        : "BuyZen Support";


    /*
     * ==========================================
     * ZUSTAND
     * ==========================================
     */

    const {
        messages,
        loading,
        error: storeError,
        getMessages,
        addMessage,
        clearMessages
    } = useMessageStore();


    /*
     * ==========================================
     * LOCAL STATE
     * ==========================================
     */

    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);


    /*
     * ==========================================
     * CURRENT USER ID
     * ==========================================
     *
     * Sender ID is NOT sent by the client.
     *
     * The backend gets the authenticated
     * WebSocket user and determines senderId.
     */

    const getCurrentUserId = () => {

        const token = localStorage.getItem("jwt_token");

        if (!token) {
            return null;
        }

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            return Number(payload.userId);

        } catch (error) {

            console.error(
                "Failed to parse JWT:",
                error
            );

            return null;
        }
    };

    const currentUserId = getCurrentUserId();


    /*
     * ==========================================
     * AUTO SCROLL
     * ==========================================
     */

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    /*
     * ==========================================
     * LOAD CHAT + CONNECT WEBSOCKET
     * ==========================================
     */

    useEffect(() => {

        if (!chatId || Number.isNaN(chatId)) {

            setError("Chat information is missing.");
            return;
        }

        let unsubscribe;

        const initializeChat = async () => {

            try {

                setError(null);

                /*
                 * Clear messages from previous chat
                 * before loading the new conversation.
                 */

                clearMessages();

                /*
                 * Load existing messages through Zustand.
                 */

                await getMessages(chatId);

                /*
                 * Connect WebSocket.
                 */

                await connect();

                /*
                 * Subscribe to incoming messages.
                 */

                unsubscribe = subscribeToMessages((message) => {

                    /*
                     * Only display messages belonging
                     * to the current conversation.
                     */

                    if (
                        Number(message.chatId) !==
                        Number(chatId)
                    ) {
                        return;
                    }

                    addMessage(message);
                });

            } catch (error) {

                console.error(
                    "CHAT INITIALIZATION ERROR:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load conversation."
                );
            }
        };

        initializeChat();

        /*
         * Cleanup subscription when leaving chat.
         */

        return () => {

            if (unsubscribe) {
                unsubscribe();
            }

        };

    }, [
        chatId,
        getMessages,
        addMessage,
        clearMessages
    ]);


    /*
     * ==========================================
     * SEND MESSAGE
     * ==========================================
     */

    const handleSendMessage = (event) => {

        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            return;
        }

        /*
         * Receiver ID is required.
         *
         * senderId is deliberately NOT passed.
         */

        if (
            !receiverId ||
            Number.isNaN(receiverId)
        ) {

            setError(
                "Receiver information is missing."
            );

            return;
        }

        try {

            sendMessage(
                receiverId,
                trimmedContent
            );

            setContent("");
            setError(null);

        } catch (error) {

            console.error(
                "SEND MESSAGE ERROR:",
                error
            );

            setError(
                error?.message ||
                "Unable to send message."
            );
        }
    };


    /*
     * ==========================================
     * ENTER KEY
     * ==========================================
     */

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSendMessage(event);
        }
    };


    /*
     * ==========================================
     * BACK BUTTON
     * ==========================================
     */

    const handleBack = () => {

        if (isAdminChat) {

            navigate("/admin/messages");

        } else {

            navigate(-1);
        }
    };


    /*
     * ==========================================
     * DISPLAY ERROR
     * ==========================================
     */

    const displayedError =
        error || storeError;


    /*
     * ==========================================
     * UI
     * ==========================================
     */

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* ================= HEADER ================= */}

            <div className="bg-white border-b border-slate-200">

                <div className="max-w-5xl mx-auto px-4 md:px-6">

                    <div className="h-16 flex items-center gap-3">

                        <button
                            type="button"
                            onClick={handleBack}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
                        >

                            <svg
                                className="w-5 h-5 text-slate-600"
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

                        </button>


                        {/* Avatar */}

                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">

                            {otherUserName
                                ?.charAt(0)
                                ?.toUpperCase()
                            }

                        </div>


                        {/* User information */}

                        <div className="min-w-0">

                            <h1 className="text-sm font-semibold text-slate-900 truncate">

                                {otherUserName}

                            </h1>

                            <p className="text-xs text-slate-500">

                                {isAdminChat
                                    ? "Customer"
                                    : "BuyZen Support"
                                }

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= CHAT AREA ================= */}

            <div className="flex-1">

                <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


                        {/* Messages */}

                        <div className="h-[calc(100vh-190px)] min-h-[400px] overflow-y-auto p-4 md:p-6">


                            {/* Loading */}

                            {loading && (
                                <div className="flex items-center justify-center h-full">

                                    <div className="flex flex-col items-center">

                                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />

                                        <p className="text-sm text-slate-500 mt-3">

                                            Loading messages...

                                        </p>

                                    </div>

                                </div>
                            )}


                            {/* Error */}

                            {!loading &&
                                displayedError && (

                                    <div className="flex items-center justify-center h-full">

                                        <div className="text-center">

                                            <div className="w-12 h-12 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center">

                                                <svg
                                                    className="w-6 h-6"
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

                                            <p className="mt-3 text-sm font-medium text-slate-700">

                                                {displayedError}

                                            </p>

                                        </div>

                                    </div>
                                )}


                            {/* Empty chat */}

                            {!loading &&
                                !displayedError &&
                                messages.length === 0 && (

                                    <div className="flex items-center justify-center h-full">

                                        <div className="text-center">

                                            <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">

                                                <svg
                                                    className="w-7 h-7"
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

                                            <h3 className="mt-4 text-sm font-semibold text-slate-900">

                                                No messages yet

                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">

                                                Start the conversation below.

                                            </p>

                                        </div>

                                    </div>
                                )}


                            {/* Message list */}

                            {!loading &&
                                !displayedError &&
                                messages.length > 0 && (

                                    <div className="space-y-3">

                                        {messages.map((message, index) => {

                                            const senderId =
                                                Number(message.senderId);

                                            const isMine =
                                                senderId ===
                                                currentUserId;

                                            return (
                                                <div
                                                    key={
                                                        message.id ||
                                                        `${message.chatId}-${index}`
                                                    }
                                                    className={`flex ${
                                                        isMine
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >

                                                    <div
                                                        className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl ${
                                                            isMine
                                                                ? "bg-blue-600 text-white rounded-br-md"
                                                                : "bg-slate-100 text-slate-800 rounded-bl-md"
                                                        }`}
                                                    >

                                                        <p className="text-sm whitespace-pre-wrap break-words">

                                                            {message.content}

                                                        </p>

                                                        {message.createdAt && (

                                                            <p
                                                                className={`text-[10px] mt-1 ${
                                                                    isMine
                                                                        ? "text-blue-100"
                                                                        : "text-slate-400"
                                                                }`}
                                                            >

                                                                {new Date(
                                                                    message.createdAt
                                                                ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit"
                                                                    }
                                                                )}

                                                            </p>

                                                        )}

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>
                                )}


                            <div ref={messagesEndRef} />

                        </div>


                        {/* ================= INPUT ================= */}

                        <form
                            onSubmit={handleSendMessage}
                            className="border-t border-slate-200 p-4"
                        >

                            <div className="flex items-end gap-3">

                                <textarea
                                    value={content}
                                    onChange={(event) =>
                                        setContent(event.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    rows={1}
                                    className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />


                                <button
                                    type="submit"
                                    disabled={!content.trim()}
                                    className="w-11 h-11 shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition"
                                >

                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m22 2-7 20-4-9-9-4Z"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M22 2 11 13"
                                        />

                                    </svg>

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ChatPage;
 