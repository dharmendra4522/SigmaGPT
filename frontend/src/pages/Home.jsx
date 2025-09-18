// src/pages/Home.jsx

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../components/MyContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "../App.css";

function Home() {
    // --- YEH NAYI STATE ADD HUI HAI ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default is open
    // ------------------------------------

    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv4());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    const providerValues = {
        isSidebarOpen, setIsSidebarOpen, // <-- Nayi state ko context me add karein
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads
    };

    return (
        // --- YAHAN CLASSNAME CHANGE HUA HAI ---
        <div className={isSidebarOpen ? "main" : "main sidebar-closed"}>
        {/* ------------------------------------ */}
            <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default Home;