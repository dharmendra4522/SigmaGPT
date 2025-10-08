import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../components/MyContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "../App.css";

function Home() {
    // This state controls the sidebar's visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // All your other chat-related states
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(null);
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    // Logic to load the last active chat on page refresh
    useEffect(() => {
        const activeThreadId = sessionStorage.getItem('activeThreadId');
        if (activeThreadId) {
            setCurrThreadId(activeThreadId);
            setNewChat(false);
            const fetchMessages = async () => {
                try {
                    const response = await fetch(`/api/chat/${activeThreadId}`);
                    const res = await response.json();
                    if (res.error) throw new Error(res.error);
                    setPrevChats(res.messages || []);
                } catch (err) {
                    console.error("Failed to load previous chat", err);
                    sessionStorage.removeItem('activeThreadId');
                    setCurrThreadId(uuidv4());
                    setNewChat(true);
                }
            };
            fetchMessages();
        } else {
            setCurrThreadId(uuidv4());
            setNewChat(true);
        }
    }, []);

    // Logic to save the active chat ID to sessionStorage
    useEffect(() => {
        if (currThreadId && !newChat) {
            sessionStorage.setItem('activeThreadId', currThreadId);
        }
    }, [currThreadId, newChat]);

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
        <div className={isSidebarOpen ? "main" : "main sidebar-closed"}>
            <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default Home;

