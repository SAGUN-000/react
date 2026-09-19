import { create } from "zustand";

const useMessageBoxStore = create((set) => ({
    message: null,
    type: "info",

    showMessage: (message, type = "info") => {
        set({
            message,
            type,
        });
    },

    clearMessage: () => {
        set({
            message: null,
            type: "info",
        });
    },
}));

export default useMessageBoxStore;