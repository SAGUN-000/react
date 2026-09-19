import { useEffect } from "react";
import useMessageBoxStore from "../store/MessageBoxStore";

const MessageBox = () => {
    const { message, type, clearMessage } = useMessageBoxStore();

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            clearMessage();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, clearMessage]);

    if (!message) return null;

    const styles = {
        success: {
            background: "#ecfdf5",
            border: "#10b981",
            text: "#047857",
            icon: "✓",
        },
        error: {
            background: "#fef2f2",
            border: "#ef4444",
            text: "#b91c1c",
            icon: "✕",
        },
        warning: {
            background: "#fffbeb",
            border: "#f59e0b",
            text: "#b45309",
            icon: "⚠",
        },
        info: {
            background: "#eff6ff",
            border: "#3b82f6",
            text: "#1d4ed8",
            icon: "ⓘ",
        },
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                minWidth: "300px",
                maxWidth: "450px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: currentStyle.background,
                border: `1px solid ${currentStyle.border}`,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                color: currentStyle.text,
            }}
        >
            <span
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                }}
            >
                {currentStyle.icon}
            </span>

            <span
                style={{
                    flex: 1,
                    fontSize: "14px",
                    fontWeight: "500",
                }}
            >
                {message}
            </span>

            <button
                onClick={clearMessage}
                style={{
                    border: "none",
                    background: "transparent",
                    color: currentStyle.text,
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "0",
                }}
            >
                ×
            </button>
        </div>
    );
};

export default MessageBox;