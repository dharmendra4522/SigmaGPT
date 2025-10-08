import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
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

