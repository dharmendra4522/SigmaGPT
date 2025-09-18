import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { authUser } = useAuthContext();

    // Agar user logged in hai, to use page dikhao.
    // Outlet ka matlab hai is route ke andar jo bhi child component (jaise Home) hai, use render karo.
    // Agar user logged in nahi hai, to use login page par bhej do.
    return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;