import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../components/MyContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "../App.css";

function Home() {
    // Chat se judi saari state ab yahan manage hogi
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv4());
    const [prevChats, setPrevChats] = useState([]); // Shuru me empty array
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    // Context ke zariye in sabhi states ko neeche ke components me bheja jayega
    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads
    };

    return (
        <div className="main">
            <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default Home;