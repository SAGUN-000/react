 import { create } from "zustand";
import { getMessageHistory } from "../API/MessageApi";

const useMessageStore = create((set) => ({
    messages: [],
    loading: false,
    error: null,

    getMessages: async (chatId) => {
        set({
            loading: true,
            error: null
        });

        try {
            const data = await getMessageHistory(chatId);

            set({
                messages: data.messages,
                loading: false
            });

            return data;

        } catch (error) {

            set({
                error: error.message,
                loading: false
            });

            throw error;
        }
    },

    addMessage: (message) => {
        set((state) => ({
            messages: [
                ...state.messages,
                message
            ]
        }));
    },

    clearMessages: () => {
        set({
            messages: []
        });
    }
}));

export default useMessageStore;