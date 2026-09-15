 
import axios from "axios";

const getUserPurchase = async () => {

    // Get JWT from localStorage
    const token = localStorage.getItem("jwt_token");

    // If there is no token, stop the request
    if (!token) {
        throw new Error("User is not logged in");
    }

    // Send request to backend
    const response = await axios.get(
        "http://localhost:8080/admin/user_purchase",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    // Return backend response
    return response.data;
};

const getUsers=async()=>{
    // Get JWT from localStorage
    const token = localStorage.getItem("jwt_token");

    // If there is no token, stop the request
    if (!token) {
        throw new Error("User is not logged in");
    }

     const res = await axios.get("http://localhost:8080/admin/view_users", {
                headers: { Authorization: `Bearer ${token}` }
            });

            return res.data;

}

const getAllOrders=async()=>{

      // Get JWT from localStorage
    const token = localStorage.getItem("jwt_token");

    // If there is no token, stop the request
    if (!token) {
        throw new Error("User is not logged in");
    }
    const res = await axios.get("http://localhost:8080/admin/orderDetails", {
                headers: { Authorization: `Bearer ${token}` }
            });

    return res.data


}

const updateOrderStatus=async(orderId,status)=>{

     // Get JWT from localStorage
    const token = localStorage.getItem("jwt_token");

    if (!token) {
        throw new Error("User is not logged in");
    }

    const res=await axios.patch(`http://localhost:8080/admin/${orderId}/status`,{
        status
    },{headers: { Authorization: `Bearer ${token}` }})

    return res.data;

}

  const getAllUsersWithChats = async () => {

    const token = localStorage.getItem("jwt_token");

    if (!token) {
        throw new Error("User is not logged in");
    }

    const res = await axios.get(
        "http://localhost:8080/admin/user_chats",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};

export { getUserPurchase,getUsers,getAllOrders,updateOrderStatus,getAllUsersWithChats};
 
