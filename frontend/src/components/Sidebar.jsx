// src/components/Sidebar.jsx

import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/chat/", {
                credentials: 'include' // Yeh line sabse zaroori hai
            });
            const res = await response.json();
            if (res.error) throw new Error(res.error);
            setAllThreads(res);
        } catch (err) {
            console.log("Error in getAllThreads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, []); // Yeh useEffect sirf ek baar chalna chahiye jab component load ho

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv4());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${newThreadId}`, {
                credentials: 'include' // Yeh line sabse zaroori hai
            });
            const res = await response.json();
            if (res.error) throw new Error(res.error);
            setPrevChats(res.messages);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log("Error in changeThread:", err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${threadId}`, {
                method: "DELETE",
                credentials: 'include' // Yeh line sabse zaroori hai
            });
            const res = await response.json();
            if (res.error) throw new Error(res.error);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log("Error in deleteThread:", err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="/src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        {thread.title}
                        <i className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>
            <div className="sign">
                <p>By Dharmendra Vishvkarma &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;