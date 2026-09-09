import { create } from "zustand";
 import { getMessageHistory } from "../API/MessageApi";

const useMessageStore = create((set) => ({
    messages: [],
    loading: false,
    error: null,

    getMessages: async (chatId) => {
        set({ loading: true, error: null });

        try {
            const messages = await getMessageHistory(chatId);

            set({
                messages,
                loading: false
            });
        } catch (error) {
            set({
                error: error.message,
                loading: false
            });
        }
    },

    addMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message]
        }));
    },

    clearMessages: () => {
        set({ messages: [] });
    }
}));

export default useMessageStore;