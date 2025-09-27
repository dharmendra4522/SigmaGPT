import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setNewChat, setPrevChats, setPrompt, setReply } = useContext(MyContext);

    // Fetches all chat threads for the logged-in user
    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/chat/", {
                credentials: 'include'
            });
            const res = await response.json();
            if (res.error) throw new Error(res.error);
            setAllThreads(res);
        } catch (err) {
            console.log("Error in getAllThreads:", err);
        }
    };

    // This runs once when the component first loads
    useEffect(() => {
        getAllThreads();
    }, []);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv4());
        setPrevChats([]);
        sessionStorage.removeItem('activeThreadId'); // Clears the saved chat ID
    }

    const changeThread = async (newThreadId) => {
        if (newThreadId === currThreadId && !newChat) return; // Don't reload if it's the same chat
        
        setCurrThreadId(newThreadId);
        setNewChat(false);
        setReply(null);

        try {
            const response = await fetch(`http://localhost:8080/api/chat/${newThreadId}`, {
                credentials: 'include'
            });
            const res = await response.json();
            if (res.error) throw new Error(res.error);
            setPrevChats(res.messages || []); // Ensure it's always an array
        } catch (err) {
            console.log("Error in changeThread:", err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            await fetch(`http://localhost:8080/api/chat/${threadId}`, {
                method: "DELETE",
                credentials: 'include'
            });
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            
            // If the deleted chat was the active one, start a new chat
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log("Error in deleteThread:", err);
        }
    }

    return (
        <section className="sidebar">
            <div className="sidebar-top">
                <button className="sidebar-btn" onClick={createNewChat}>
                    <img src="/src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                    <span className="btn-text">New Chat</span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
            </div>

            <ul className="history">
                {allThreads?.map((thread) => (
                    <li key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "history-item highlighted" : "history-item"}
                    >
                        <span className="history-title">{thread.title}</span>
                        <i className="fa-solid fa-trash delete-icon"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents li's onClick from firing
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sidebar-bottom">
                <a className="sign" href="https://dharmendravishwakarma.netlify.app/" target="_blank" rel="noopener noreferrer">
                    By Dharmendra Vishvkarma &hearts;
                </a>
            </div>
        </section>
    )
}

export default Sidebar;

