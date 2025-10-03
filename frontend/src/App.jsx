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