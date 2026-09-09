 
import { useEffect, useState } from "react";
import useAdminStore from "../store/adminStore";


const STATUS_OPTIONS = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
];


const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700"
};


const OrderPage = () => {

    const {
        orders,
        loadingOrders,
        error,
        fetchOrders,
        updateOrderStatus
    } = useAdminStore();

    const [updatingId, setUpdatingId] = useState(null);


    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    const handleStatusChange = async (orderId, status) => {

        try {

            setUpdatingId(orderId);

            await updateOrderStatus(orderId, status);

        } catch (error) {

            console.error("Failed to update order status:", error);

        } finally {

            setUpdatingId(null);

        }
    };


    if (loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Loading orders...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Orders
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage customer orders and update their status.
                    </p>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}


                {/* NO ORDERS */}

                {!error && orders.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                        <p className="text-slate-500">
                            No orders found.
                        </p>
                    </div>
                )}


                {/* ORDERS */}

                <div className="space-y-5">

                    {orders.map((order) => (

                        <div
                            key={order.orderId}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                        >

                            {/* ORDER HEADER */}

                            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Order #{order.orderId}
                                        </h2>

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                statusStyles[order.status] ||
                                                "bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                    <div className="mt-2 text-sm text-slate-500 space-y-1">

                                        <p>
                                            Customer:{" "}
                                            <span className="font-medium text-slate-800">
                                                {order.userName}
                                            </span>
                                        </p>

                                        <p>
                                            Email:{" "}
                                            <span className="font-medium text-slate-800">
                                                {order.email}
                                            </span>
                                        </p>

                                        <p>
                                            User ID:{" "}
                                            <span className="font-medium text-slate-800">
                                                {order.userId}
                                            </span>
                                        </p>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div>

                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Update Status
                                    </label>

                                    <select
                                        value={order.status}
                                        disabled={updatingId === order.orderId}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order.orderId,
                                                e.target.value
                                            )
                                        }
                                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >

                                        {STATUS_OPTIONS.map((status) => (

                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                            </div>


                            {/* PRODUCTS */}

                            <div className="p-5">

                                <h3 className="text-sm font-bold text-slate-800 mb-4">
                                    Products
                                </h3>

                                <div className="space-y-3">

                                    {order.products?.map((product) => (

                                        <div
                                            key={product.productId}
                                            className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                                        >

                                            {product.url ? (
                                                <img
                                                    src={product.url}
                                                    alt={product.productName}
                                                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-400">
                                                    No Image
                                                </div>
                                            )}


                                            <div className="flex-1">

                                                <p className="font-semibold text-slate-900">
                                                    {product.productName}
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    Product ID: {product.productId}
                                                </p>

                                            </div>


                                            <div className="text-sm font-semibold text-slate-700">
                                                × {product.quantity}
                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
};


export default OrderPage;
 
