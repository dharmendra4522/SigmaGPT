
// import "./App.css";
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useState } from "react";
// import {v1 as uuidv1} from "uuid";
// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setCurrThreadId] = useState(uuidv1());
//   const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
//   const [newChat, setNewChat] = useState(true);
//   const [allThreads, setAllThreads] = useState([]); //{threadId, title}

//   const providerValues = {
//     prompt, setPrompt,
//     reply, setReply,
//     currThreadId,setCurrThreadId,
//     newChat, setNewChat,
//     prevChats, setPrevChats,
//     allThreads, setAllThreads
//   };

//   return (
//     <>
//       <div className="main">
//         <MyContext.Provider value={providerValues}>
//           <Sidebar></Sidebar>
//           <ChatWindow></ChatWindow>
//         </MyContext.Provider>
//       </div>
//     </>
//   );
// }

// export default App;


// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { authUser } = useAuthContext();

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* Yeh saare routes ab protected hain */}
        <Route path='/' element={<Home />} />
      </Route>

      {/* Agar user logged in hai to login page na dikhe, use home par bhej do */}
      <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />

      {/* Agar user logged in hai to signup page na dikhe, use home par bhej do */}
      <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
    </Routes>
  );
}

export default App;