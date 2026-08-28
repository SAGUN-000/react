 import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2Success() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            return;
        }

        localStorage.setItem("jwt_token", token);

        navigate("/", { replace: true });
    }, [navigate]);

    return <p>Signing you in...</p>;
}

export default OAuth2Success;