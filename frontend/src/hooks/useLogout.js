import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        try {
            const res = await fetch("https://sigmagpt-api.onrender.com/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Logout Error:", error.message);
        } finally {
            // Hamesha logout karo, chahe API call fail ho ya pass
            localStorage.removeItem("chat-user");
            setAuthUser(null);
        }
    };

    return { logout };
};

export default useLogout;
