 import { create } from "zustand";
import {
    getUserPurchase,
    getUsers
} from "../API/AdminApi.js";

const useAdminStore = create((set) => ({

    // =========================
    // STATE
    // =========================

    userPurchases: [],
    users: [],

    loadingPurchases: false,
    loadingUsers: false,

    error: null,


    // =========================
    // FETCH USER PURCHASES
    // =========================

    fetchUserPurchases: async () => {

        set({
            loadingPurchases: true,
            error: null
        });

        try {

            const data = await getUserPurchase();

            set({
                userPurchases: data,
                loadingPurchases: false
            });

        } catch (error) {

            set({
                error: error.message,
                loadingPurchases: false
            });

        }
    },


    // =========================
    // FETCH USERS
    // =========================

     fetchUsers: async () => {

    set({
        loadingUsers: true,
        error: null
    });

    try {

        const data = await getUsers();

        console.log("API DATA:", data);
        console.log("IS ARRAY:", Array.isArray(data));

        set({
            users: data,
            loadingUsers: false
        });

    } catch (error) {

        console.error("FETCH USERS ERROR:", error);

        set({
            error: error.message,
            loadingUsers: false
        });
    }
},


    // =========================
    // SET USERS
    // =========================

    setUsers: (users) => {
        set({
            users: users
        });
    },


    // =========================
    // SET PURCHASES
    // =========================

    setUserPurchases: (purchases) => {
        set({
            userPurchases: purchases
        });
    },


    // =========================
    // CLEAR ERROR
    // =========================

    clearError: () => {
        set({
            error: null
        });
    },


    // =========================
    // RESET STORE
    // =========================

    reset: () => {
        set({
            userPurchases: [],
            users: [],
            loadingPurchases: false,
            loadingUsers: false,
            error: null
        });
    }

}));

export default useAdminStore;