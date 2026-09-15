
import { create } from "zustand";

import {
    getUserPurchase,
    getUsers,
    getAllOrders,
    updateOrderStatus,
    getAllUsersWithChats,
} from "../API/AdminApi.js";


const useAdminStore = create((set) => ({

    // =========================
    // STATE
    // =========================

    userPurchases: [],
    users: [],
    orders: [],
    userChats: [],

    loadingPurchases: false,
    loadingUsers: false,
    loadingOrders: false,
    loadingUserChats: false,

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

            return data;

        } catch (error) {

            console.error("FETCH ORDERS ERROR:", error);

            set({
                error: error.message,
                loadingOrders: false
            });

            throw error;
        }
    },


    // =========================
    // UPDATE ORDER STATUS
    // =========================

    updateOrderStatus: async (orderId, status) => {

        set({
            error: null
        });

        try {

            const updatedOrder =
                await updateOrderStatus(orderId, status);

            set((state) => ({
                orders: state.orders.map((order) =>
                    order.orderId === orderId
                        ? { ...order, ...updatedOrder }
                        : order
                )
            }));

            return updatedOrder;

        } catch (error) {

            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            set({
                error: error.message
            });

            throw error;
        }
    },


    // =========================
    // FETCH USERS WITH CHATS
    // =========================

    fetchUsersWithChats: async () => {

        set({
            loadingUserChats: true,
            error: null
        });

        try {

            const data = await getAllUsersWithChats();

            console.log("USER CHATS API DATA:", data);
            console.log("IS ARRAY:", Array.isArray(data));

            set({
                userChats: data,
                loadingUserChats: false
            });

            return data;

        } catch (error) {

            console.error(
                "FETCH USERS WITH CHATS ERROR:",
                error
            );

            set({
                error: error.message,
                loadingUserChats: false
            });

            throw error;
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
    // SET USER CHATS
    // =========================

    setUserChats: (userChats) => {

        set({
            userChats: userChats
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
            userChats: [],

            loadingPurchases: false,
            loadingUsers: false,
            loadingOrders: false,
            loadingUserChats: false,

            error: null

        });

    }

}));

console.log("ADMIN STORE STATE:", useAdminStore.getState());

export default useAdminStore;
 

 