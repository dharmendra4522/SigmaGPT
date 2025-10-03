import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useRef } from "react";
import useLogout from "../hooks/useLogout.js";

function ChatWindow() {
    const { isSidebarOpen, setIsSidebarOpen, prompt, setPrompt, currThreadId, setCurrThreadId, setPrevChats, newChat, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useLogout();
    const abortControllerRef = useRef(null);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
        }
    };

    const getReply = async () => {
        if (!prompt.trim()) return;

        abortControllerRef.current = new AbortController();
        const userMessage = { role: "user", content: prompt };
        const isNewChat = newChat;
        setNewChat(false);
        setLoading(true);
        setPrevChats(prev => [...prev, userMessage, { role: "assistant", content: "" }]);
        const currentPrompt = prompt;
        setPrompt("");

        const requestBody = { message: currentPrompt };
        if (!isNewChat) {
            requestBody.threadId = currThreadId;
        }

        try {
            const response = await fetch("https://sigmagpt-api.onrender.com/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
                credentials: 'include',
                signal: abortControllerRef.current.signal,
            });

            if (!response.body) return;
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6);
                        if (data === '[DONE]') {
                            return; 
                        }
                        const parsed = JSON.parse(data);

                        if (parsed.threadId) {
                            setCurrThreadId(parsed.threadId);
                        }
                        if (parsed.content) {
                            setPrevChats(prev => prev.map((chat, index) => 
                                index === prev.length - 1 
                                ? { ...chat, content: chat.content + parsed.content } 
                                : chat
                            ));
                        }
                    }
                }
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log("Stream stopped by user.");
                setPrevChats(prev => prev.map((chat, index) => 
                    index === prev.length - 1 && chat.content === ""
                    ? { ...chat, content: "[Response stopped by user]" } 
                    : chat
                ));
            } else {
                console.log("Error in getReply stream:", err);
                setPrevChats(prev => {
                    const newChats = [...prev];
                    newChats[newChats.length - 1].content = `Error: ${err.message}`;
                    return newChats;
                });
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

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
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading ? getReply() : ''}
                        disabled={loading}
                    />
                    {loading ? (
                        <div id="stop-generating-icon" onClick={handleStop}>
                            <i className="fa-solid fa-stop"></i>
                        </div>
                    ) : (
                        <div id="submit" onClick={getReply}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </div>
                    )}
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;

