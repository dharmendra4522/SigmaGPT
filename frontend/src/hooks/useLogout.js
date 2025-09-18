import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem("chat-user");
            setAuthUser(null);
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    return { logout };
};

export default useLogout;