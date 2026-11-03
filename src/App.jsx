import { Routes, Route } from 'react-router' //
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { UserContextProviver } from './context/UserContext'

function App() {
    return (
        <UserContextProviver>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </UserContextProviver>
    )
}

export default App
