 import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

import useAdminStore from "../store/adminStore";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);


// =====================================================
// ICONS
// =====================================================

function DashboardIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
        </svg>
    );
}


function ProductIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3.5 8.5 12 3.75l8.5 4.75L12 13.25 3.5 8.5Z" />
            <path d="M3.5 8.5v7L12 20.25l8.5-4.75v-7" />
            <path d="M12 13.25v7" />
        </svg>
    );
}


function OrderIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6.5 8.5h11l1.2 10.25a1.5 1.5 0 0 1-1.49 1.67H6.79a1.5 1.5 0 0 1-1.49-1.67L6.5 8.5Z" />
            <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
        </svg>
    );
}


function UsersIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
            <path d="M15.5 5.5a3.2 3.2 0 0 1 0 6.4" />
            <path d="M17 14.5a5.5 5.5 0 0 1 3.5 5.5" />
        </svg>
    );
}


function InventoryIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
            <path d="m4 12 8 4.5 8-4.5" />
            <path d="m4 16.5 8 4.5 8-4.5" />
        </svg>
    );
}


function ReportsIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19.5V14" />
            <path d="M10 19.5V9" />
            <path d="M16 19.5V5" />
            <path d="M22 19.5V11" />
        </svg>
    );
}


function SettingsIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20h-2.12v-.09a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 7.2 15a1.7 1.7 0 0 0-1.55-1.03H5.5v-2.12h.15A1.7 1.7 0 0 0 7.2 10.8a1.7 1.7 0 0 0-.34-1.88L6.8 8.86l1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V6h2.12v.21a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1.03h.15v2.12h-.15A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
    );
}


function ChatIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4.5 2.5 1.25-4.75A7.5 7.5 0 1 1 20 11.5Z" />
            <path d="M8 11.5h.01" />
            <path d="M12 11.5h.01" />
            <path d="M16 11.5h.01" />
        </svg>
    );
}


function StoreIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 10h18" />
            <path d="m5 10 1-6h12l1 6" />
            <path d="M5 10v9h14v-9" />
            <path d="M9 19v-5h6v5" />
        </svg>
    );
}


function ProfileIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
    );
}


function LogoMark() {
    return (
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tight">
                Bz
            </span>
        </div>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({ title, value, delta, icon }) {

    const isPositive = delta?.value >= 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="text-2xl font-semibold text-slate-900 mt-2 truncate">
                        {value}
                    </p>

                </div>

                <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    {icon}
                </div>

            </div>

            {delta && (
                <p
                    className={`text-xs mt-3 ${
                        isPositive
                            ? "text-emerald-600"
                            : "text-red-500"
                    }`}
                >
                    <span className="font-semibold">
                        {isPositive ? "▲" : "▼"}
                    </span>{" "}
                    {Math.abs(delta.value).toFixed(1)}%{" "}
                    <span className="text-slate-500">
                        {delta.label}
                    </span>
                </p>
            )}

        </div>
    );
}


// =====================================================
// SIDEBAR
// =====================================================

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <DashboardIcon />,
        },
        {
            name: "Products",
            path: "/",
            icon: <ProductIcon />,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: <OrderIcon />,
        },
        {
            name: "Customers",
            path: "/admin/customers",
            icon: <UsersIcon />,
        },
        {
            name: "Inventory",
            path: "/admin/inventory",
            icon: <InventoryIcon />,
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: <ReportsIcon />,
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <SettingsIcon />,
        },
        {
            name: "Chat",
            path: "/admin/users/messages",
            icon: <ChatIcon />,
        },
    ];

    return (
        <aside className="w-60 pr-6 hidden lg:block shrink-0">

            <div className="sticky top-6">

                <nav className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

                    {/* BRAND */}

                    <div className="px-4 py-4 border-b border-slate-100">

                        <div className="flex items-center gap-3">

                            <LogoMark />

                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    BuyZen
                                </p>

                                <p className="text-xs text-slate-400">
                                    Admin Panel
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* NAVIGATION */}

                    <div className="p-3">

                        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Management
                        </p>

                        <ul className="space-y-1">

                            {items.map((item) => {

                                const isActive =
                                    item.path === "/admin"
                                        ? location.pathname === "/admin"
                                        : location.pathname === item.path;

                                return (
                                    <li key={item.name}>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(item.path)
                                            }
                                            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                            }`}
                                        >

                                            <span
                                                className={
                                                    isActive
                                                        ? "text-blue-600"
                                                        : "text-slate-400"
                                                }
                                            >
                                                {item.icon}
                                            </span>

                                            <span>
                                                {item.name}
                                            </span>

                                        </button>

                                    </li>
                                );

                            })}

                        </ul>


                        {/* STORE */}

                        <div className="pt-4 mt-4 border-t border-slate-100">

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <StoreIcon />

                                <span>
                                    Back to Store
                                </span>

                            </button>

                        </div>

                    </div>

                </nav>

            </div>

        </aside>
    );
}


// =====================================================
// USER AVATAR
// =====================================================

function UserAvatar({ name }) {

    const initial =
        name?.trim()?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
            {initial}
        </div>
    );
}


// =====================================================
// ROLE BADGE
// =====================================================

function RoleBadge({ role }) {

    const normalizedRole =
        String(role || "USER").toUpperCase();

    const isAdmin = normalizedRole === "ADMIN";

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                isAdmin
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-600"
            }`}
        >
            {normalizedRole}
        </span>
    );
}


// =====================================================
// DASHBOARD
// =====================================================

export default function Dashboard() {

    const navigate = useNavigate();

    const users = useAdminStore(
        (state) => state.users
    );

    const orders = useAdminStore(
        (state) => state.orders
    );

    const loadingUsers = useAdminStore(
        (state) => state.loadingUsers
    );

    const error = useAdminStore(
        (state) => state.error
    );

    const fetchUsers = useAdminStore(
        (state) => state.fetchUsers
    );

    const fetchOrders = useAdminStore(
        (state) => state.fetchOrders
    );


    // =================================================
    // AUTHENTICATION
    // =================================================

    useEffect(() => {

        const token =
            localStorage.getItem("jwt_token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const currentTime =
                Math.floor(Date.now() / 1000);

            if (
                !payload.exp ||
                payload.exp < currentTime
            ) {

                localStorage.removeItem(
                    "jwt_token"
                );

                navigate("/login", {
                    replace: true,
                });
            }

        } catch {

            localStorage.removeItem(
                "jwt_token"
            );

            navigate("/login", {
                replace: true,
            });
        }

    }, [navigate]);


    // =================================================
    // FETCH DATA
    // =================================================

    useEffect(() => {

        fetchUsers();
        fetchOrders();

    }, [fetchUsers, fetchOrders]);


    // =================================================
    // NORMALIZE ORDERS
    // =================================================

    const rawOrders = useMemo(() => {

        if (Array.isArray(orders)) {
            return orders;
        }

        return orders?.content || [];

    }, [orders]);


    // =================================================
    // DATE HELPERS
    // =================================================

    const getDate = (item) => {

        if (!item?.createdAt) {
            return null;
        }

        const parsed =
            new Date(item.createdAt);

        return Number.isNaN(
            parsed.getTime()
        )
            ? null
            : parsed;
    };


    // =================================================
    // PERCENTAGE CHANGE
    // =================================================

    const calculatePercentageChange = (
        current,
        previous
    ) => {

        if (previous === 0) {

            if (current === 0) {
                return 0;
            }

            return 100;
        }

        return (
            ((current - previous) / previous) *
            100
        );
    };


    // =================================================
    // STATISTICS
    // =================================================

    const stats = useMemo(() => {

        const now = new Date();

        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const yesterdayStart =
            new Date(todayStart);

        yesterdayStart.setDate(
            yesterdayStart.getDate() - 1
        );

        const weekStart =
            new Date(todayStart);

        weekStart.setDate(
            weekStart.getDate() - 7
        );

        const previousWeekStart =
            new Date(weekStart);

        previousWeekStart.setDate(
            previousWeekStart.getDate() - 7
        );


        // -----------------------------
        // USERS
        // -----------------------------

        const usersToday =
            users.filter((user) => {

                const date = getDate(user);

                return (
                    date &&
                    date >= todayStart
                );

            }).length;


        const usersYesterday =
            users.filter((user) => {

                const date = getDate(user);

                return (
                    date &&
                    date >= yesterdayStart &&
                    date < todayStart
                );

            }).length;


        // -----------------------------
        // ORDERS
        // -----------------------------

        const ordersThisWeek =
            rawOrders.filter((order) => {

                const date = getDate(order);

                return (
                    date &&
                    date >= weekStart
                );

            }).length;


        const ordersPreviousWeek =
            rawOrders.filter((order) => {

                const date = getDate(order);

                return (
                    date &&
                    date >= previousWeekStart &&
                    date < weekStart
                );

            }).length;


        // -----------------------------
        // ORDER TOTAL
        // -----------------------------

        const getOrderTotal = (order) => {

            if (!Array.isArray(order.products)) {
                return 0;
            }

            return order.products.reduce(
                (sum, product) =>
                    sum +
                    Number(product.price || 0) *
                    Number(product.quantity || 0),
                0
            );
        };


        // -----------------------------
        // SALES
        // -----------------------------

        const salesThisWeek =
            rawOrders
                .filter((order) => {

                    const date =
                        getDate(order);

                    return (
                        date &&
                        date >= weekStart
                    );

                })
                .reduce(
                    (sum, order) =>
                        sum +
                        getOrderTotal(order),
                    0
                );


        const salesPreviousWeek =
            rawOrders
                .filter((order) => {

                    const date =
                        getDate(order);

                    return (
                        date &&
                        date >= previousWeekStart &&
                        date < weekStart
                    );

                })
                .reduce(
                    (sum, order) =>
                        sum +
                        getOrderTotal(order),
                    0
                );


        // -----------------------------
        // PENDING
        // -----------------------------

        const pendingOrders =
            rawOrders.filter(
                (order) =>
                    String(order.status || "")
                        .toUpperCase() ===
                    "PENDING"
            ).length;


        // -----------------------------
        // TOTAL SALES
        // -----------------------------

        const totalSales =
            rawOrders.reduce(
                (sum, order) =>
                    sum +
                    getOrderTotal(order),
                0
            );


        return {

            users: users.length,

            orders: rawOrders.length,

            sales: totalSales,

            pending: pendingOrders,

            userChange:
                calculatePercentageChange(
                    usersToday,
                    usersYesterday
                ),

            orderChange:
                calculatePercentageChange(
                    ordersThisWeek,
                    ordersPreviousWeek
                ),

            salesChange:
                calculatePercentageChange(
                    salesThisWeek,
                    salesPreviousWeek
                ),

        };

    }, [users, rawOrders]);


    // =================================================
    // STATIC CHART
    // =================================================

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false,
                },

                tooltip: {
                    mode: "index",
                    intersect: false,
                },
            },

            scales: {

                x: {
                    grid: {
                        display: false,
                    },

                    ticks: {
                        color: "#94a3b8",
                    },
                },

                y: {
                    grid: {
                        color: "#f1f5f9",
                    },

                    ticks: {
                        color: "#94a3b8",
                    },
                },

            },

            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
            },

        }),
        []
    );


    const chartData = useMemo(
        () => ({

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
                "50k",
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
                        70,
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
                            "rgba(37,99,235,0.20)"
                        );

                        gradient.addColorStop(
                            1,
                            "rgba(37,99,235,0)"
                        );

                        return gradient;
                    },

                    fill: true,

                    tension: 0.35,

                    pointRadius: 3,

                    pointHoverRadius: 5,

                    pointBackgroundColor:
                        "#2563EB",

                    pointBorderWidth: 0,
                },
            ],

        }),
        []
    );


    // =================================================
    // UI
    // =================================================

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-[1200px] mx-auto p-6">


                {/* HEADER */}

                <header className="mb-6 flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-4">

                    <div>

                        <h1 className="text-xl font-semibold text-slate-900">
                            Dashboard
                        </h1>

                        <p className="text-sm text-slate-500 mt-0.5">
                            Overview of recent activity
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/profile"
                            )
                        }
                        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
                    >

                        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <ProfileIcon />
                        </span>

                        <span className="text-sm font-medium text-slate-900 pr-1">
                            Profile
                        </span>

                    </button>

                </header>


                <div className="flex gap-6">

                    <Sidebar />


                    <main className="flex-1 min-w-0">


                        {/* STATS */}

                        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

                            <StatCard
                                title="Total Users"
                                value={stats.users.toLocaleString()}
                                delta={{
                                    value:
                                        stats.userChange,
                                    label:
                                        "new users vs yesterday",
                                }}
                                icon={
                                    <UsersIcon
                                        className="w-5 h-5"
                                    />
                                }
                            />


                            <StatCard
                                title="Total Orders"
                                value={stats.orders.toLocaleString()}
                                delta={{
                                    value:
                                        stats.orderChange,
                                    label:
                                        "from previous week",
                                }}
                                icon={
                                    <OrderIcon
                                        className="w-5 h-5"
                                    />
                                }
                            />


                            <StatCard
                                title="Total Sales"
                                value={`$${stats.sales.toLocaleString(
                                    "en-US",
                                    {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }
                                )}`}
                                delta={{
                                    value:
                                        stats.salesChange,
                                    label:
                                        "from previous week",
                                }}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="8.5"
                                        />
                                        <path d="M12 7v10" />
                                        <path d="M15 9.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
                                    </svg>
                                }
                            />


                            <StatCard
                                title="Pending Orders"
                                value={stats.pending.toLocaleString()}
                                delta={null}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="8.5"
                                        />
                                        <path d="M12 7.5v5l3 2" />
                                    </svg>
                                }
                            />

                        </section>


                        {/* USERS */}

                        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">


                            {/* USERS HEADER */}

                            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">

                                <div>

                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Users
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        Recently registered users
                                    </p>

                                </div>


                                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                    {users.length} total
                                </span>

                            </div>


                            {loadingUsers && (

                                <div className="px-6 py-10 text-center">

                                    <p className="text-sm text-slate-500">
                                        Loading users...
                                    </p>

                                </div>

                            )}


                            {!loadingUsers && error && (

                                <div className="px-6 py-10 text-center">

                                    <p className="text-sm text-red-500">
                                        Error: {error}
                                    </p>

                                </div>

                            )}


                            {!loadingUsers && !error && (

                                <div className="overflow-x-auto">

                                    <table className="w-full">


                                        {/* TABLE HEADER */}

                                        <thead>

                                            <tr className="bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400">

                                                <th className="px-6 py-3 text-left font-medium">
                                                    User
                                                </th>

                                                <th className="px-6 py-3 text-left font-medium">
                                                    Email
                                                </th>

                                                <th className="px-6 py-3 text-left font-medium">
                                                    Role
                                                </th>

                                            </tr>

                                        </thead>


                                        {/* TABLE BODY */}

                                        <tbody>

                                            {users.length > 0 ? (

                                                users.map(
                                                    (
                                                        user,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                user.id ||
                                                                index
                                                            }
                                                            className="group border-t border-slate-100 hover:bg-slate-50/70 transition-colors"
                                                        >

                                                            {/* USER */}

                                                            <td className="px-6 py-4">

                                                                <div className="flex items-center gap-3">

                                                                    <UserAvatar
                                                                        name={
                                                                            user.username
                                                                        }
                                                                    />

                                                                    <div className="min-w-0">

                                                                        <p className="text-sm font-medium text-slate-900 truncate">
                                                                            {user.username ||
                                                                                "Unnamed User"}
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* EMAIL */}

                                                            <td className="px-6 py-4">

                                                                <span className="text-sm text-slate-500">
                                                                    {user.email ||
                                                                        "—"}
                                                                </span>

                                                            </td>


                                                            {/* ROLE */}

                                                            <td className="px-6 py-4">

                                                                <RoleBadge
                                                                    role={
                                                                        user.role
                                                                    }
                                                                />

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            ) : (

                                                <tr>

                                                    <td
                                                        className="px-6 py-10 text-center text-sm text-slate-500"
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

                        <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">


                            <div className="flex items-center justify-between mb-5">

                                <div>

                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Sales Details
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        Sales performance overview
                                    </p>

                                </div>


                                <select
                                    disabled
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                                >

                                    <option>
                                        October
                                    </option>

                                    <option>
                                        November
                                    </option>

                                </select>

                            </div>


                            <div className="w-full h-56 rounded-lg p-2">

                                <Line
                                    options={chartOptions}
                                    data={chartData}
                                />

                            </div>

                        </section>

                    </main>

                </div>

            </div>

        </div>
    );
}