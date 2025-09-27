import "./Chat.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./MyContext";
import { useAuthContext } from '../context/AuthContext';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Helper function to reliably extract text content from React children
const getNodeText = (node) => {
    if (typeof node === 'string' || typeof node === 'number') {
        return node;
    }
    if (Array.isArray(node)) {
        return node.map(getNodeText).join('');
    }
    if (node && node.props && node.props.children) {
        return getNodeText(node.props.children);
    }
    return '';
};

// Custom component for rendering code blocks
const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeText = getNodeText(children);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return !inline && match ? (
        <div className="code-block">
            <div className="code-header">
                <span>{match[1]}</span>
                <CopyToClipboard text={codeText} onCopy={handleCopy}>
                    <button className="copy-btn">
                        {copied ? (
                            <><i className="fa-solid fa-check"></i> Copied!</>
                        ) : (
                            <><i className="fa-regular fa-copy"></i> Copy code</>
                        )}
                    </button>
                </CopyToClipboard>
            </div>
            <pre className={className} {...props}>
                <code>{children}</code>
            </pre>
        </div>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};


function Chat() {
    const { newChat, prevChats, currThreadId } = useContext(MyContext);
    const { authUser } = useAuthContext();
    const chatAreaRef = useRef(null);
    const activeThreadIdRef = useRef(null);
    const prevMessagesCountRef = useRef(0); // <-- YEH NAYI LINE ADD KAREIN



//     useEffect(() => {
//     const chatArea = chatAreaRef.current;
//     if (!chatArea) return;

//     const scrollToBottom = () => {
//         chatArea.scrollTop = chatArea.scrollHeight;
//     };

//     const threadChanged = activeThreadIdRef.current !== currThreadId;
    
//     // Case 1: Agar chat thread badal gaya hai (ya pehli baar load hua hai), to hamesha neeche scroll karo.
//     if (threadChanged) {
//         setTimeout(scrollToBottom, 0); // Timeout DOM update ke liye
//         activeThreadIdRef.current = currThreadId;
//         return;
//     }

//     const lastMessage = prevChats[prevChats.length - 1];
//     if (!lastMessage) return;

//     // Case 2: Agar user ne abhi-abhi message bheja hai (AI ka khali placeholder add hua hai), to hamesha neeche scroll karo.
//     if (lastMessage.role === 'assistant' && lastMessage.content === '') {
//         scrollToBottom();
//         return;
//     }

//     // Case 3: Agar AI ka response stream ho raha hai, to "smart scrolling" use karo.
//     const isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 50; // 50px ka buffer
//     if (isScrolledToBottom) {
//         scrollToBottom();
//     }
// }, [prevChats, currThreadId]);


// YEH NAYA CODE HAI - ISE PASTE KAREIN


// src/components/Chat.jsx

// YEH NAYA AUR FINAL useEffect HAI - PURANE KO ISSE REPLACE KAREIN
useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;

    const scrollToBottom = () => {
        chatArea.scrollTop = chatArea.scrollHeight;
    };

    const prevCount = prevMessagesCountRef.current;
    const currentCount = prevChats.length;
    const justLoadedChat = prevCount === 0 && currentCount > 0;
    const lastMessage = prevChats[currentCount - 1];

    // Case 1: Agar chat abhi-abhi load hui hai (refresh ya switch), to hamesha neeche scroll karo.
    if (justLoadedChat) {
        setTimeout(scrollToBottom, 0); // Timeout DOM update ke liye
    } 
    // Case 2: Agar user ne naya message bheja hai, to hamesha neeche scroll karo.
    else if (lastMessage?.role === 'assistant' && lastMessage.content === '') {
        scrollToBottom();
    }
    // Case 3: Agar AI stream kar raha hai, to "smart scrolling" use karo.
    else {
        const isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 50;
        if (isScrolledToBottom) {
            scrollToBottom();
        }
    }

    // Aakhri me, purane message count ko update kar do
    prevMessagesCountRef.current = currentCount;

}, [prevChats]); // Dependency ab sirf prevChats hai


    return (
        <div className="chat-area" ref={chatAreaRef}>
            {newChat && <h1 className="welcome-message">Hello, {authUser?.name}! How can I help you today?</h1>}
            <div className="chats">
                {
                    prevChats?.map((chat, idx) => (
                        <div
                            className={chat.role === "user" ? "userDiv" : "gptDiv"}
                            key={idx}
                        >
                            {
                                chat.role === "user" ?
                                    <p className="userMessage">{chat.content}</p> :
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{ code: CodeBlock }}
                                    >
                                        {chat.content}
                                    </ReactMarkdown>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Chat;

