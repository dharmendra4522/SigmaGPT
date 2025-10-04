import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        try {
            // Send a request to the backend to clear the HTTP-only cookie
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
        } catch (error) {
            // Log the error but don't stop the logout process
            console.error("Logout API Error:", error.message);
        } finally {
            // Always clear the user from local storage and context on the frontend
            localStorage.removeItem("chat-user");
            setAuthUser(null);
        }
    };

    return { logout };
};

export default useLogout;

