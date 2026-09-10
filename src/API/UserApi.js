 import axios from "axios";

const updatePassword = async (oldPass, newPass) => {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    throw new Error("User is not logged in");
  }

  const res = await axios.patch(
    "http://localhost:8080/user/password",
    {
      oldPass,
      newPass,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export { updatePassword };