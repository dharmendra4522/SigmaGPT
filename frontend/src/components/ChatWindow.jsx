import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import useLogout from "../hooks/useLogout.js";

function ChatWindow() {
    const {isSidebarOpen, setIsSidebarOpen, prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, setPrevChats, newChat, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useLogout();

    const getReply = async () => {
        if (!prompt.trim()) return;

        const userMessage = prompt; // Bheje jaane wale message ko save kar lo
        setNewChat(false);
        setLoading(true);
        setPrevChats(prev => [...prev, { role: "user", content: userMessage }]); // User ka message UI par turant dikhao
        setPrompt(""); // Input field ko turant clear kar do

        const requestBody = {
            message: userMessage, // Save kiya hua message bhejo
        };

        if (!newChat) {
            requestBody.threadId = currThreadId;
        }

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            if (res.error) throw new Error(res.error);

            setCurrThreadId(res.threadId);
            setReply(res.response); // Yeh useEffect ko trigger karega

        } catch (err) {
            console.log("Error in getReply:", err);
            // Yahan UI par error dikhane ka logic daal sakte hain
            setPrevChats(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
        }
        setLoading(false);
    }

    // Yeh useEffect ab sirf AI ka response aane par chalega
    useEffect(() => {
        if (reply) {
            setPrevChats(prev => [...prev, { role: "assistant", content: reply }]);
        }
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div className="navbar-left">
                    <div className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat />
            <div className="loader-container">
                <ScaleLoader color="#fff" loading={loading} />
            </div>
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;