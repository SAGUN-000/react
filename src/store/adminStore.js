 
import { create } from "zustand";

import {
    getUserPurchase,
    getUsers,
    getAllOrders,

    
} from "../API/AdminApi.js";


const useAdminStore = create((set) => ({

    // =========================
    // STATE
    // =========================

    userPurchases: [],
    users: [],
    orders: [],

    loadingPurchases: false,
    loadingUsers: false,
    loadingOrders: false,

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

            console.error("FETCH USER PURCHASES ERROR:", error);

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

            console.log("USERS API DATA:", data);
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
    // FETCH ORDERS
    // =========================

    fetchOrders: async () => {

        set({
            loadingOrders: true,
            error: null
        });

        try {

            const data = await getAllOrders();

            console.log("ORDERS API DATA:", data);
            console.log("IS ARRAY:", Array.isArray(data));

            set({
                orders: data,
                loadingOrders: false
            });

        } catch (error) {

            console.error("FETCH ORDERS ERROR:", error);

            set({
                error: error.message,
                loadingOrders: false
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
    // SET ORDERS
    // =========================

    setOrders: (orders) => {

        set({
            orders: orders
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
            orders: [],

            loadingPurchases: false,
            loadingUsers: false,
            loadingOrders: false,

            error: null
        });

    }

}));


export default useAdminStore;
 

 
 