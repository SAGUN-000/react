 import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
 
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import useAdminStore from "../store/adminStore";
import * as messageApi from "../API/MessageApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function StatCard({ title, value, delta, icon, colorClass }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5 flex-1 min-w-[160px]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm mt-3 text-slate-500">{delta}</p>
        </div>
    );
}

function Sidebar({ current = "Dashboard",  }) {
    const navigate = useNavigate();
    const items = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
            ),
        },
        {
            name: "Products",
            path: "/",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
            ),
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            ),
        },
        {
            name: "Customers",
            path: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            ),
        },
        {
            name: "Inventory",
            path: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            ),
        },
        {
            name: "Reports",
            path: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
            ),
        },
        {
            name: "Settings",
            path: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            ),
        },

        // =========================
        // CHAT
        // =========================
        {
            name: "Chat",
            path: "/admin/users/messages",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.188 49.188 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <aside className="w-60 pr-6 hidden lg:block shrink-0">
            <div className="sticky top-6">
                <div 
                    onClick={() => navigate('/admin')}
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow cursor-pointer transition hover:scale-105"
                >
                    <span className="text-white font-bold text-lg">Bz</span>
                </div>
                <nav className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <ul className="space-y-1.5">
                        {items.map((it) => {
                            const isActive = it.name.toLowerCase() === current.toLowerCase();

                            return (
                                <li
                                    key={it.name}
                                    onClick={() => {
                                         if (it.path) {
                                            navigate(it.path);
                                        }  
                                    }}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                >
                                    <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                                        {it.icon}
                                    </span>
                                    <span>{it.name}</span>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span>Back to Store</span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
}

export default function Dashboard() {

    const navigate = useNavigate();

    // =========================
    // CHAT HANDLER
    // =========================

     


    // =========================
    // ZUSTAND STORE
    // =========================

    const users = useAdminStore((state) => state.users);
    const orders = useAdminStore((state) => state.orders);
    const loadingUsers = useAdminStore((state) => state.loadingUsers);
    const loadingOrders = useAdminStore((state) => state.loadingOrders);
    const error = useAdminStore((state) => state.error);
    const fetchUsers = useAdminStore((state) => state.fetchUsers);
    const fetchOrders = useAdminStore((state) => state.fetchOrders);

    // =========================
    // STATS
    // =========================

    const stats = useMemo(() => {
        const userCount = Array.isArray(users) && users.length > 0 ? users.length.toLocaleString() : "40,689";
        const rawOrders = Array.isArray(orders) ? orders : orders?.content || [];
        const orderCount = rawOrders.length > 0 ? rawOrders.length.toLocaleString() : "10,293";
        const pendingCount = rawOrders.length > 0 
            ? rawOrders.filter(o => (o.status || o.orderStatus || "").toUpperCase() === "PENDING").length.toLocaleString()
            : "2,040";
        const totalSalesVal = rawOrders.length > 0
            ? rawOrders.reduce((sum, o) => sum + Number(o.totalPrice || o.totalAmount || o.price || 0), 0)
            : 89000;
        const formattedSales = `$${totalSalesVal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        return {
            users: userCount,
            orders: orderCount,
            sales: formattedSales,
            pending: pendingCount
        };
    }, [users, orders]);


    // =========================
    // CHECK TOKEN
    // =========================

    const isTokenExpired = (token) => {

        if (!token) {
            return true;
        }

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const currentTime = Math.floor(
                Date.now() / 1000
            );

            return !payload.exp || payload.exp < currentTime;

        } catch (error) {

            return true;

        }
    };


    // =========================
    // CHECK AUTHENTICATION
    // =========================

    useEffect(() => {

        const checkToken = () => {

            const token = localStorage.getItem("jwt_token");

            if (!token || isTokenExpired(token)) {

                localStorage.removeItem("jwt_token");

                navigate("/login", {
                    replace: true
                });
            }
        };


        checkToken();

        const interval = setInterval(
            checkToken,
            1000
        );


        return () => {
            clearInterval(interval);
        };

    }, [navigate]);


    // =========================
    // FETCH USERS & ORDERS
    // =========================

    useEffect(() => {

        fetchUsers();
        fetchOrders();

    }, [fetchUsers, fetchOrders]);


    // =========================
    // UI
    // =========================

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-[1200px] mx-auto p-6">

                {/* HEADER */}

                <div className="mb-6 flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm px-6 py-4">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold">
                                Bz
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Admin Panel
                            </p>

                            <h1 className="text-lg font-semibold text-slate-900">
                                Dashboard
                            </h1>
                        </div>

                    </div>


                    <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition hover:bg-slate-50">

                        <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6.75a3.75 3.75 0 11-7.5 0v0a3.75 3.75 0 017.5 0z"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 20.25a8.25 8.25 0 0115 0"
                                />
                            </svg>

                        </span>

                        <span className="text-sm font-medium text-slate-900">
                            Profile
                        </span>

                    </button>

                </div>


                <div className="flex gap-6">

                    <Sidebar  />


                    <main className="flex-1">

                        {/* PAGE TITLE */}

                        <div className="mb-6">

                            <h1 className="text-3xl font-bold text-slate-900">
                                Dashboard
                            </h1>

                            <p className="text-slate-500 mt-1">
                                Overview of recent activity
                            </p>

                        </div>


                        {/* STATS */}

                        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                            <StatCard
                                title="Total User"
                                value={stats.users}
                                delta={
                                    <span className="text-green-500">
                                        ▲ 8.5% Up from yesterday
                                    </span>
                                }
                                icon={
                                    <svg
                                        className="w-6 h-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 1 0-6 0v1a3 3 0 0 0 6 0v-1z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 21a7.5 7.5 0 0 1 15 0"
                                        />
                                    </svg>
                                }
                                colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
                            />

                            <StatCard
                                title="Total Order"
                                value={stats.orders}
                                delta={
                                    <span className="text-green-500">
                                        ▲ 1.3% Up from past week
                                    </span>
                                }
                                icon={ 
                                    <svg
                                        className="w-6 h-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 1 0-6 0v1a3 3 0 0 0 6 0v-1z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 21a7.5 7.5 0 0 1 15 0"
                                        />
                                    </svg>
                                }
                                colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
                            />

                            <StatCard
                                title="Total Sales"
                                value={stats.sales}
                                delta={
                                    <span className="text-red-500">
                                        ▼ 4.3% Down from yesterday
                                    </span>
                                }
                                icon={
                                    <svg
                                        className="w-6 h-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 1 0-6 0v1a3 3 0 0 0 6 0v-1z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 21a7.5 7.5 0 0 1 15 0"
                                        />
                                    </svg>
                                }
                                colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
                            />

                            <StatCard
                                title="Total Pending"
                                value={stats.pending}
                                delta={
                                    <span className="text-green-500">
                                        ▲ 1.8% Up from yesterday
                                    </span>
                                }
                                icon={
                                    <svg
                                        className="w-6 h-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 1 0-6 0v1a3 3 0 0 0 6 0v-1z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 21a7.5 7.5 0 0 1 15 0"
                                        />
                                    </svg>
                                }
                                colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
                            />

                        </section>


                        {/* USERS */}

                        <section className="mt-6 bg-white rounded-xl shadow-sm p-6">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-lg font-semibold text-slate-900">
                                    Users
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Total: {users.length}
                                </p>

                            </div>


                            {/* LOADING */}

                            {loadingUsers && (
                                <p className="text-sm text-slate-500">
                                    Loading users...
                                </p>
                            )}


                            {/* ERROR */}

                            {!loadingUsers && error && (
                                <p className="text-sm text-red-500">
                                    Error: {error}
                                </p>
                            )}


                            {/* TABLE */}

                            {!loadingUsers && !error && (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left">

                                        <thead>

                                            <tr className="text-sm text-slate-500 border-b">

                                                <th className="py-3">
                                                    Name
                                                </th>

                                                <th className="py-3">
                                                    Email
                                                </th>

                                                <th className="py-3">
                                                    Role
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {users.length > 0 ? (

                                                users.map((user, index) => (

                                                    <tr
                                                        key={user.id || index}
                                                        className="border-b last:border-b-0 hover:bg-slate-50"
                                                    >

                                                        <td className="py-3">
                                                            {user.name || "—"}
                                                        </td>

                                                        <td className="py-3">
                                                            {user.email || "—"}
                                                        </td>

                                                        <td className="py-3">
                                                            {user.role || "USER"}
                                                        </td>

                                                    </tr>

                                                ))

                                            ) : (

                                                <tr>

                                                    <td
                                                        className="py-4 text-sm text-slate-500"
                                                        colSpan={3}
                                                    >
                                                        No users found.
                                                    </td>

                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>


                        {/* SALES CHART */}

                        <section className="bg-white rounded-xl shadow-sm p-6">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-lg font-semibold text-slate-900">
                                    Sales Details
                                </h2>

                                <select className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-sm">

                                    <option>
                                        October
                                    </option>

                                    <option>
                                        November
                                    </option>

                                </select>

                            </div>


                            <div className="w-full h-56 bg-gradient-to-b from-slate-50 to-white rounded-lg p-4">

                                <Line 
                                    options={useMemo(() => ({ 
                                        responsive: true, 
                                        maintainAspectRatio: false, 
 
                                        plugins: { 
                                            legend: { 
                                                display: false 
                                            } 
                                        }, 
 
                                        scales: { 
                                            x: { 
                                                grid: { 
                                                    display: false 
                                                } 
                                            }, 
 
                                            y: { 
                                                grid: { 
                                                    color: "#f1f5f9" 
                                                } 
                                            } 
                                        } 
 
                                    }), [])} 
 
                                    data={useMemo(() => ({ 
 
                                        labels: [ 
                                            "5k", 
                                            "10k", 
                                            "15k", 
                                            "20k", 
                                            "25k", 
                                            "30k", 
                                            "35k", 
                                            "40k", 
                                            "45k", 
                                            "50k" 
                                        ], 
 
                                        datasets: [ 
                                            { 
                                                label: "Sales", 
 
                                                data: [ 
                                                    20, 
                                                    45, 
                                                    38, 
                                                    90, 
                                                    56, 
                                                    67, 
                                                    42, 
                                                    75, 
                                                    62, 
                                                    70 
                                                ], 
 
                                                borderColor: "#2563EB", 
 
                                                backgroundColor: (context) => { 
 
                                                    const ctx = 
                                                        context.chart.ctx; 
 
                                                    const gradient = 
                                                        ctx.createLinearGradient( 
                                                            0, 
                                                            0, 
                                                            0, 
                                                            200 
                                                        ); 
 
                                                    gradient.addColorStop( 
                                                        0, 
                                                        "rgba(37,99,235,0.25)" 
                                                    ); 
 
                                                    gradient.addColorStop( 
                                                        1, 
                                                        "rgba(37,99,235,0)" 
                                                    ); 
 
                                                    return gradient; 
                                                }, 
 
                                                fill: true, 
                                                tension: 0.3, 
                                                pointRadius: 3, 
                                                pointBackgroundColor: "#2563EB" 
                                            } 
                                        ] 
 
                                    }), [])} 
 
                                /> 
 
                            </div> 
 
                        </section> 
 
                    </main> 
 
                </div> 
 
            </div> 
 
        </div> 
    );
}