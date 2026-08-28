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

function Sidebar() {
    const items = [
        "Dashboard",
        "Products",
        "Orders",
        "Customers",
        "Inventory",
        "Reports",
        "Settings",
    ];

    return (
        <aside className="w-60 pr-6 hidden lg:block">
            <div className="sticky top-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow">
                    <span className="text-white font-bold">Bz</span>
                </div>
                <nav className="bg-white rounded-xl p-4 shadow-sm">
                    <ul className="space-y-2">
                        {items.map((it) => (
                            <li key={it} className="text-slate-700 hover:text-slate-900 py-2 px-3 rounded-md hover:bg-slate-50 cursor-pointer">{it}</li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

 
 
 

 

// Your existing imports
// import Sidebar from "...";
// import StatCard from "...";
// import { Line } from "react-chartjs-2";


export default function Dashboard() {

    const navigate = useNavigate();


    // =========================
    // STATS
    // =========================

    const [stats, setStats] = useState({
        users: "40,689",
        orders: "10,293",
        sales: "$89,000",
        pending: "2,040"
    });


    // =========================
    // ZUSTAND STORE
    // =========================

    const users = useAdminStore((state) => state.users);
    console.log("USERS FROM STORE:", users);
    const loading = useAdminStore((state) => state.loadingUsers);
    const error = useAdminStore((state) => state.error);
    const fetchUsers = useAdminStore((state) => state.fetchUsers);


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
    // FETCH USERS
    // =========================

    useEffect(() => {

        fetchUsers();

    }, [fetchUsers]);


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

                    <Sidebar />


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

                            {loading && (
                                <p className="text-sm text-slate-500">
                                    Loading users...
                                </p>
                            )}


                            {/* ERROR */}

                            {!loading && error && (
                                <p className="text-sm text-red-500">
                                    Error: {error}
                                </p>
                            )}


                            {/* TABLE */}

                            {!loading && !error && (

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
 
