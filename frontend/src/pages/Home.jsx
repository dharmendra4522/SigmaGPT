import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../components/MyContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "../App.css";
import { useAuthContext } from "../context/AuthContext.jsx";

function Home() {
    // This state controls the sidebar's visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // All chat-related states
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(null);
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);
    
    const { authUser } = useAuthContext();

    // This effect runs only once when the component first loads
    useEffect(() => {
        // Only try to load a session if a user is logged in
        if (authUser) {
            const activeThreadId = sessionStorage.getItem(`activeThreadId_${authUser._id}`);
            if (activeThreadId) {
                // If a saved chat ID is found, load it
                setCurrThreadId(activeThreadId);
                setNewChat(false);
                const fetchMessages = async () => {
                    try {
                        const response = await fetch(`/api/chat/${activeThreadId}`);
                        const res = await response.json();
                        if (res.error) throw new Error(res.error);
                        setPrevChats(res.messages || []);
                    } catch (err) {
                        console.error("Failed to load previous chat, starting new one.", err);
                        sessionStorage.removeItem(`activeThreadId_${authUser._id}`);
                        setCurrThreadId(uuidv4());
                        setNewChat(true);
                    }
                };
                fetchMessages();
            } else {
                // If no saved chat is found, start a new one
                setCurrThreadId(uuidv4());
                setNewChat(true);
            }
        }
    }, [authUser]); // Run this effect when authUser changes (i.e., on login)

    // This effect saves the active chat ID to sessionStorage whenever it changes
    useEffect(() => {
        if (currThreadId && !newChat && authUser) {
            sessionStorage.setItem(`activeThreadId_${authUser._id}`, currThreadId);
        }
    }, [currThreadId, newChat, authUser]);

    const providerValues = {
        isSidebarOpen, setIsSidebarOpen,
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads
    };

    return (
        // This className is crucial for the collapsible sidebar animation
        <div className={isSidebarOpen ? "main" : "main sidebar-closed"}>
            <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default Home;

