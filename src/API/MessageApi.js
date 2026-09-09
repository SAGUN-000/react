import axios from "axios";

const getChatId=async(receiverId)=>{

    const token = localStorage.getItem("jwt_token");

    // If there is no token, stop the request
    if (!token) {
        throw new Error("User is not logged in");
    }

    const res=await axios.get(`http://localhost:8080/chat/${receiverId}`,{
        headers: { Authorization: `Bearer ${token}` }
    })

    return res.data;
}

const getMessageHistory=async(chatId)=>{

    const token = localStorage.getItem("jwt_token");

    // If there is no token, stop the request
    if (!token) {
        throw new Error("User is not logged in");
    }

    const res=await axios.get(`http://localhost:8080/chat/${chatId}`,{
         headers: { Authorization: `Bearer ${token}` }
    })

    return res.data;
}

export {getMessageHistory,getChatId}