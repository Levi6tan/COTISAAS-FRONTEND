import { Routes, Route } from 'react-router' //
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { UserContextProvider } from './context/UserContext'
import { Toaster } from 'react-hot-toast'

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
            <Toaster />
        </UserContextProvider>
    )
}

export default App
