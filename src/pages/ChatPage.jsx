 import { useEffect, useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import useMessageStore from "../store/MessageStore";
import {
  connect,
  sendMessage,
  subscribeToMessages,
} from "../socket/socketClient";

const getCurrentUserId = () => {
  const token = localStorage.getItem("jwt_token");

  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const claims = JSON.parse(atob(base64));

    const userId = Number(claims.userId);

    return Number.isFinite(userId) ? userId : null;
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
};

function ChatPage() {
  const { chatId: chatIdParam } = useParams();
  const { state } = useLocation();

  const chatId = Number(chatIdParam);
  const sellerId = Number(state?.sellerId);

  const [inputText, setInputText] = useState("");
  const [socketReady, setSocketReady] = useState(false);
  const [sendError, setSendError] = useState(null);

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const currentUserId = getCurrentUserId();

  const {
    messages,
    loading,
    error,
    getMessages,
    addMessage,
    clearMessages,
  } = useMessageStore();

  /*
   * Load chat history
   */
  useEffect(() => {
    if (!Number.isFinite(chatId)) return;

    clearMessages();
    getMessages(chatId);
  }, [chatId, getMessages, clearMessages]);

  /*
   * WebSocket connection + subscription
   */
  useEffect(() => {
    if (!Number.isFinite(chatId)) return;

    let subscription = null;
    let mounted = true;

    try {
      connect();

      const trySubscribe = () => {
        if (!mounted || subscription) return;

        try {
          const sub = subscribeToMessages((receivedMessage) => {
            if (!receivedMessage) return;

            if (
              Number(receivedMessage.chatId) === Number(chatId)
            ) {
              addMessage(receivedMessage);
            }
          });

          if (sub) {
            subscription = sub;
            subscriptionRef.current = sub;
            setSocketReady(true);
          } else if (mounted) {
            setTimeout(trySubscribe, 300);
          }
        } catch {
          if (mounted) {
            setTimeout(trySubscribe, 300);
          }
        }
      };

      trySubscribe();
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      setSocketReady(false);
    }

    return () => {
      mounted = false;

      setSocketReady(false);

      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (error) {
          console.error("Failed to unsubscribe:", error);
        }

        subscriptionRef.current = null;
      }
    };
  }, [chatId, addMessage]);

  /*
   * Clear messages when leaving the page
   */
  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, [clearMessages]);

  /*
   * Scroll to latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
   * Send message
   *
   * sellerId is the receiverId.
   * senderId is determined by the backend from JWT.
   */
  const handleSendMessage = () => {
    const content = inputText.trim();

    if (
      !content ||
      !Number.isFinite(chatId) ||
      !Number.isFinite(sellerId)
    ) {
      return;
    }

    try {
      sendMessage(sellerId, content);

      setInputText("");
      setSendError(null);
    } catch (error) {
      console.error("Failed to send message:", error);

      setSendError(
        "Failed to send message. Please check your connection."
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleSendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  /*
   * Invalid chat ID or missing seller ID
   */
  if (
    !Number.isFinite(chatId) ||
    !Number.isFinite(sellerId)
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Invalid chat
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            The chat could not be opened.
          </p>

          <Link
            to="/profile"
            className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 md:px-6 flex flex-col items-center">

      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[82vh] min-h-[550px] overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">

          <div className="flex items-center gap-3.5">

            <div className="relative">

              <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white">

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
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.154-.63 4.545 4.545 0 0 1 1.258-3.033A8.196 8.196 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>

              </div>

              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />

            </div>

            <div>

              <h1 className="text-base font-bold text-slate-900">
                Buyzen Customer Support
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">

                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />

                <span>
                  {socketReady
                    ? "Online Support Team"
                    : "Connecting..."}
                </span>

              </div>

            </div>

          </div>

          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Chat #{chatId}
          </span>

        </div>

        {/* Error */}
        {(error || sendError) && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-200">

            <div className="flex items-center justify-between">

              <span className="text-sm text-red-700">
                {error || sendError}
              </span>

            </div>

          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/60">

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">

              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />

              <p className="text-sm font-medium text-slate-500 mt-3">
                Loading conversation history...
              </p>

            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">

              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">

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
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.188 49.188 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>

              </div>

              <h3 className="text-base font-semibold text-slate-900">
                Start a conversation
              </h3>

              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Have questions about your order or products?
                Send a message below to connect with Buyzen
                customer support.
              </p>

            </div>
          )}

          {!loading &&
            messages.map((message, index) => {

              const isUser =
                currentUserId !== null &&
                Number(message.senderId) === currentUserId;

              return (
                <div
                  key={`${message.chatId}-${message.senderId}-${index}`}
                  className={`flex items-end gap-2.5 min-w-0 ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                      A
                    </div>
                  )}

                  <div
                    className={`flex flex-col min-w-0 ${
                      isUser
                        ? "items-end"
                        : "items-start"
                    }`}
                  >

                    <span className="text-[11px] font-medium text-slate-400 mb-1 px-1">
                      {isUser ? "You" : "Support"}
                    </span>

                    {/* Message bubble */}
                    <div
                      className={`px-4 py-2.5 text-sm w-fit max-w-[85%] md:max-w-[70%] min-w-0 whitespace-pre-wrap break-words shadow-sm ${
                        isUser
                          ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                          : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      {message.content}
                    </div>

                  </div>

                </div>
              );
            })}

          <div ref={messagesEndRef} />

        </div>

        {/* Composer */}
        <div className="p-4 bg-white border-t border-slate-200">

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3"
          >

            <textarea
              value={inputText}
              onChange={(event) =>
                setInputText(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-150 max-h-32 min-h-[44px]"
            />

            <button
              type="submit"
              disabled={
                !inputText.trim() ||
                !socketReady ||
                loading
              }
              className="h-11 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shrink-0"
            >
              <span>Send</span>

              <svg
                className="w-4 h-4 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 0 0-1.788 0l-7 14a1 1 0 0 0 1.169 1.409l5-1.429A1 1 0 0 0 9 15.571V11a1 1 0 1 1 2 0v4.571a1 1 0 0 0 .725.962l5 1.428a1 1 0 0 0 1.17-1.408l-7-14z" />
              </svg>

            </button>

          </form>

          <p className="text-xs text-slate-400 mt-2">
            Press Enter to send · Shift + Enter for a new line
          </p>

        </div>

      </div>

    </div>
  );
}

export default ChatPage;