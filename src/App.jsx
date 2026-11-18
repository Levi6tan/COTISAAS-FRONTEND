import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import { UserContextProvider } from './context/UserContext'
import { Toaster } from 'react-hot-toast'

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
            <Toaster />
        </UserContextProvider>
    )
}

export default App
